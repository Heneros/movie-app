import { LoggerService } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
export declare class CloudinaryService {
    private readonly logger;
    private prisma;
    constructor(logger: LoggerService, prisma: PrismaService);
    uploadFileAvatarUser(userId: number, file: Express.Multer.File, originalName?: string): Promise<{
        avatar: number;
    }>;
    uploadFromUrl(imageUrl: string, publicId: string): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string): Promise<any>;
    uploadGalleryImages(movieId: number, files: Express.Multer.File[]): Promise<{
        images: any[];
    }>;
}
