import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { tempRegisterDate } from '@/data/defaultData';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { PrismaService } from '@/prisma/prisma.service';

interface OAuthUserData {
    // id: string;
    email: string;
    name: string;
    avatarUrl: string;
    provider: string;
    providerId: string;
    password: string;
}

@Injectable()
export class HandleIOauth {
    constructor(
        protected authRepository: AuthRepository,
        protected JwtService: JwtService,
        protected cloudinaryService: CloudinaryService,
        protected readonly prisma: PrismaService,
    ) {}

    protected async handleOauthLogin(email: string): Promise<User> {
        // console.log(email);
        let user = await this.authRepository.findUser({
            email: email,
        });

        const payload = {
            id: user.id,
            name: user.name,
            roles: user.roles,
        };

        const accessTokenJwt = await this.JwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshTokenJwt = await this.JwtService.signAsync(payload, {
            expiresIn: '31d',
        });

        // console.log(accessTokenJwt, refreshTokenJwt);
        const token = await this.authRepository.findTokenByUserId(user.id);

        // console.log(token);
        if (!token) {
            await this.authRepository.createToken({
                userId: user.id,
                token: refreshTokenJwt,
                tempDate: tempRegisterDate,
            });
            return user;
        } else {
            ///Remove
            await this.authRepository.deleteToken({
                where: { userId: user.id },
            });

            await this.authRepository.createToken({
                userId: user.id,
                token: refreshTokenJwt,
                tempDate: tempRegisterDate,
            });

            // console.log(payload);
        }

        await this.authRepository.updateProfile(user.id, {
            refreshToken: [accessTokenJwt],
        });

        return user;
    }

    async uploadAvatarToCloudinary(avatarUrl: string, id: string) {
        if (!avatarUrl) return null;

        const publicId = `nestjsMoviedb/avatars/${id}_${Date.now()}`;
        return await this.cloudinaryService.uploadFromUrl(avatarUrl, publicId);
    }

    async createUserViaOauth(userData: OAuthUserData) {
        const { email, name, provider, avatarUrl, providerId, password } =
            userData;

        // console.log(email, name, provider, avatarUrl, providerId, password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const providerField = {
            [`${provider}Id`]: providerId,
        };
        const avatarPublicId = `nestjsMoviedb/avatars/${providerId}_${Date.now()}`;
        let cloudinaryAvatar = null;

        //  console.log({ userData });

        if (avatarUrl) {
            cloudinaryAvatar = await this.cloudinaryService.uploadFromUrl(
                avatarUrl,
                avatarPublicId,
            );
        }

        return this.prisma.user.create({
            data: {
                email,
                name,
                isEmailVerified: true,
                password: hashedPassword,
                provider,
                ...providerField,
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
    }
}
