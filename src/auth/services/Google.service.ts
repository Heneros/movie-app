import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/Auth.repository';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from 'cloudinary';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class GoogleService {
    constructor(
        private authRepository: AuthRepository,
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
        private jwt: JwtService,
    ) {}

    async validateGoogleUser(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });

        if (user) {
            throw new BadRequestException('User registered');
        }
        // console.log(profile);
        const avatarPublicId = `nestjsMoviedb/avatars/${profile.id}_${Date.now()}`;

        let cloudinaryAvatar = null;
        if (profile.avatar) {
            cloudinaryAvatar = await this.cloudinaryService.uploadFromUrl(
                profile.avatar,
                avatarPublicId,
            );
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.googleId, salt);

        console.log({ cloudinaryAvatar });

        // if (!user) {
        user = await this.prisma.user.create({
            data: {
                email: profile.email,
                name: profile.name,
                // avatar: profile.avatar,
                isEmailVerified: true,
                googleId: profile.googleId,
                password: hashedPassword,
                avatar: cloudinaryAvatar
                    ? {
                          create: {
                              url: cloudinaryAvatar.url,
                              publicId: cloudinaryAvatar.publicId,
                          },
                      }
                    : undefined,
            },
        });
        // }
        return user;
    }
}
