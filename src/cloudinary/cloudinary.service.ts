import { Injectable } from '@nestjs/common';
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from 'cloudinary';
import { Express } from 'express';
import * as path from 'path';
import { CloudinaryResponse } from './cloudinary-response';
import streamifier from 'streamifier';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CloudinaryService {
    // constructor(private prisma: PrismaService) {}

    async uploadFile(
        // userId: number,
        fileBuffer: Buffer,
        originalName: string,
    ): Promise<{ url: string } | undefined> {
        try {
            const mainFolder = 'nestjsMoviedb';
            const fileName = path.parse(originalName).name;
            const uniqueFileName = `${fileName}_${Date.now()}`;

            const filePathOnCloudinary = `${mainFolder}/${uniqueFileName};`;

            return new Promise((resolve, reject) => {
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

                            // await this.prisma.user.update({
                            //     where: {
                            //         id: userId,
                            //     },
                            //     data: {
                            //         avatar: result.secure_url,
                            //     },
                            // });
                        } else {
                            reject(
                                new Error(
                                    'Failed to get secure_url from Cloudinary response',
                                ),
                            );
                        }
                    },
                );
                streamifier.createReadStream(fileBuffer).pipe(uploadStream);
            });
        } catch (error) {
            console.error('Error in uploadToCloudinary:', error);
        }
    }

    async deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId);
    }
}
