import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { UploadController } from './upload.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    imports: [CloudinaryModule],
    providers: [UploadService, PrismaService],
    controllers: [UploadController],
})
export class UploadModule {}
