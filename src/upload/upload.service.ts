import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    constructor(
        private cloudinary: CloudinaryService,
        private prisma: PrismaService,
    ) {}

    // async uploadAvatar(userId: number, file: Buffer, originalName: string) {
    //     const result = await this.cloudinary.uploadFile(file, originalName);

    //     // const image = await this.prisma.user.update({
    //     //     where: {
    //     //         id: userId,
    //     //     },
    //     //     data: {
    //     //         publicId: result.public_id,
    //     //         avatar: result.url,
    //     //     },
    //     // });
    // }
}
