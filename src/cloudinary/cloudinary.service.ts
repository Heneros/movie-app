import {
    BadRequestException,
    Inject,
    Injectable,
    LoggerService,
    NotFoundException,
} from '@nestjs/common';
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from 'cloudinary';
import * as path from 'path';
const streamifier = require('streamifier');
import { PrismaService } from '@/prisma/prisma.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { url } from 'inspector';

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private prisma: PrismaService,
    ) {}

    async uploadFileAvatarUser(
        userId: number,
        // fileBuffer: Buffer,
        file: Express.Multer.File,
        originalName?: string,
    ) {
        // : Promise<{ url: string } | undefined>
        try {
            if (!file.mimetype.startsWith('image/')) {
                throw new BadRequestException({
                    message: 'Invalid image file',
                    name: 'Error',
                    http_code: 400,
                });
            }

            const avatar = await this.prisma.avatar.findUnique({
                where: { userId },
                // include: { avatar: true },
            });

            if (!avatar) {
                throw new NotFoundException('Avatar not found');
            }

            if (avatar) {
                await this.deleteImage(avatar.publicId);
                await this.prisma.avatar.delete({
                    where: { id: avatar.id },
                });
            }

            const mainFolder = 'nestjsMoviedb';
            const fileName = path.parse(originalName).name;
            const uniqueFileName = `${fileName}_${Date.now()}`;

            const filePathOnCloudinary = `${mainFolder}/${uniqueFileName};`;

            const imageC = await new Promise<{ url: string }>(
                (resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            public_id: filePathOnCloudinary,
                            // resource_type: 'auto',
                            resource_type: 'image',
                            fetch_format: 'auto',
                            quality: 'auto:eco',
                            crop: 'limit',
                        },
                        (
                            err: UploadApiErrorResponse | undefined,
                            result: UploadApiResponse | undefined,
                        ) => {
                            if (err) {
                                this.logger.error(`Cloudinary:  ${err}`);

                                reject(err);
                            } else if (result && result.secure_url) {
                                resolve({ url: result.secure_url });
                            } else {
                                reject(
                                    new Error(
                                        'Failed to get secure_url from Cloudinary response',
                                    ),
                                );
                            }
                        },
                    );
                    streamifier
                        .createReadStream(file.buffer)
                        .pipe(uploadStream);
                },
            );

            const newAvatar = await this.prisma.avatar.create({
                data: {
                    url: imageC.url,
                    publicId: filePathOnCloudinary,
                    userId: userId,
                },
            });

            return { avatar: newAvatar.id };
            // const updatedUser = await this.prisma.avatar.update({
            //     where: { id: userId },
            //     data: {
            //         url: imageC.url,
            //         publicId: filePathOnCloudinary,
            //     },
            // });

            // return { avatar: updatedUser.id };
        } catch (error) {
            // console.error('Error in uploadToCloudinary:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Error in uploadToCloudinary::  ${error}`);
        }
    }

    async uploadFromUrl(
        imageUrl: string,
        publicId: string,
    ): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                imageUrl,
                {
                    public_id: publicId,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!result?.secure_url) {
                        return reject(new Error('Upload failed'));
                    }
                    // console.log({ result });

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );
        });
    }

    async uploadGalleryImages(movieId: number, files: Express.Multer.File[]) {
        const mainFolder = 'nestjsMoviedb';

        const savedImages = [];

        for (const file of files) {
            const originalName = file.originalname;
            const fileName = path.parse(originalName).name;
            const uniqueFileName = `${fileName}_${Date.now()}`;
            const filePathOnCloudinary = `${mainFolder}/${uniqueFileName}`;

            const uploaded = await new Promise<{
                url: string;
                publicId: string;
            }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        public_id: filePathOnCloudinary,
                        resource_type: 'image',
                        fetch_format: 'auto',
                        quality: 'auto:eco',
                    },
                    (err, result) => {
                        if (err) reject(err);
                        else if (result?.secure_url)
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                            });
                        else reject(new Error('No Cloudinary URL'));
                    },
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });

            const newGallery = await this.prisma.gallery.create({
                data: {
                    url: uploaded.url,
                    publicId: uploaded.publicId,
                },
            });

            await this.prisma.movie.update({
                where: { id: movieId },
                data: {
                    galleryId: newGallery.id,
                },
            });

            savedImages.push(newGallery);
        }

        return { images: savedImages };
    }

    async uploadPreview(movieId: number, file: Express.Multer.File) {
        const mainFolder = 'nestjsMoviedb';

        // console.log('test');

        const originalName = file.originalname;
        const fileName = path.parse(originalName).name;
        const uniqueFileName = `${fileName}_${Date.now()}`;

        const filePathOnCloudinary = `${mainFolder}/${uniqueFileName}`;
        const uploaded = await new Promise<{
            url: string;
            publicId: string;
        }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    public_id: filePathOnCloudinary,
                    resource_type: 'image',
                    fetch_format: 'auto',
                    quality: 'auto:eco',
                },
                (err, result) => {
                    if (err) reject(err);
                    else if (result?.secure_url)
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    else reject(new Error('No Cloudinary URL'));
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        const previewId = await this.prisma.avatar.create({
            data: {
                url: uploaded.url,
                publicId: uploaded.publicId,
                //   previewId: uploaded.
            },
        });

        if (!previewId) {
            return `Not found ${movieId}`;
        }

        await this.prisma.movie.update({
            where: {
                id: movieId,
            },
            data: {
                previewId: previewId.id,
            },
        });

        return previewId;
    }

    async getImagePreview(previewId: number) {
        const res = await this.prisma.avatar.findUnique({
            where: {
                id: previewId,
            },
        });
        if (!res) {
            throw new NotFoundException('Not found image');
        }
        return res;
    }

    async deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId);
    }

    async deleteImagePreview(previewId: number) {
        const res = await this.prisma.avatar.findUnique({
            where: {
                id: previewId,
            },
        });
        if (!res) {
            throw new NotFoundException('Not found image');
        }

        await this.prisma.avatar.delete({
            where: {
                id: previewId,
            },
        });
        await cloudinary.uploader.destroy(res.publicId);

        return res.id;
    }
}
