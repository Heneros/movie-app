import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import bcrypt from 'bcrypt';

import { AuthRepository } from '../repositories/Auth.repository';

import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { HandleIOauth } from '../services';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly prisma: PrismaService,
        private readonly handleIOauth: HandleIOauth,
        private readonly cloudinaryService: CloudinaryService,

        config: ConfigService,
    ) {
        super({
            clientID: config.get('GITHUB_CLIENT_ID'),
            clientSecret: config.get('GITHUB_CLIENT_SECRET'),
            callbackURL: config.get('GITHUB_CALLBACK_URL'),
            proxy: true,
            scope: ['user:email'],
            // scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const { displayName, emails, id } = profile;
        // console.log(accessToken, refreshToken);
        const email = profile?.emails?.[0]?.value;

        if (!email) {
            throw new NotFoundException('Email not found');
        }

        const user = await this.authRepository.findUser({
            email,
        });
        if (user?.blocked) {
            throw new BadRequestException('User is blocked');
        }
        if (user) {
            return user;
        }
        // if (!user) {
        // const avatarPublicId = `nestjsMoviedb/avatars/${profile.id}_${Date.now()}`;

        // const avatarPublicId = await this.handleIOauth.uploadAvatarToCloudinary(
        //     profile._json.avatar_url,
        //     id,
        // );

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.id, salt);

        const userData = {
            providerId: id,
            email,
            name: displayName,
            provider: profile.provider,
            password: hashedPassword,
            avatarUrl: profile._json.avatar_url,
        };

        await this.handleIOauth.createUserViaOauth({
            // id: id,
            // email: email,
            // name: displayName || 'Unknown',
            // provider: profile.provider,
            // avatarUrl: profile._json.avatar_url,
            ...userData,
        });

        // await this.prisma.user.create({
        //     data: {
        //         email: email,
        //         name: displayName,
        //         isEmailVerified: true,
        //         githubId: id,
        //         password: hashedPassword,
        //         avatar: {
        //             create: {
        //                 url: avatarPublicId.url,
        //                 publicId: avatarPublicId.publicId,
        //             },
        //         },
        //     },
        // });
        // }

        return {
            email: email,
            name: displayName || 'Unknown',
            avatar: profile._json.avatar_url,
            githubId: id,
            accessToken,
            refreshToken,
        };
    }
}
