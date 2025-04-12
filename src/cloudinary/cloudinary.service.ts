import { Injectable, NotFoundException } from '@nestjs/common';
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from 'cloudinary';
import { Express } from 'express';
import * as path from 'path';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CloudinaryService {
    constructor(private prisma: PrismaService) {}

    async uploadFileAvatarUser(
        userId: number,
        // fileBuffer: Buffer,
        file: Express.Multer.File,
        originalName: string,
    ) {
        // : Promise<{ url: string } | undefined>
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { avatar: true },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (user.avatar) {
                await this.deleteImage(user.avatar.publicId);
                await this.prisma.avatar.delete({
                    where: { id: user.avatar.id },
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
                                console.error('Cloudinary upload error:', err);
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

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    avatar: {
                        create: {
                            url: imageC.url,
                            publicId: filePathOnCloudinary,
                        },
                    },
                },
            });

            return { avatar: updatedUser.avatarId };
        } catch (error) {
            console.error('Error in uploadToCloudinary:', error);
        }
    }

    async deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId);
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

            const saved = await this.prisma.gallery.create({
                data: {
                    url: uploaded.url,
                    publicId: uploaded.publicId,
                    movie: {
                        connect: { id: movieId },
                    },
                },
            });
            savedImages.push(saved);
        }

        return { images: savedImages };
    }
}
