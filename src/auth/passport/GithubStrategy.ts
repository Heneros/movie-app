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
import { tempRegisterDate } from '@/data/defaultData';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly prisma: PrismaService,
        private readonly JwtService: JwtService,
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

        if (!emails || !emails[0]?.value || !profile.emails[0].value) {
            throw new NotFoundException('Email not found');
        }

        const user = await this.authRepository.findUser({
            email: emails[0].value,
        });
        if (user?.blocked) {
            throw new BadRequestException('User is blocked');
        }
        if (user) {
            return user;
        }
        if (!user) {
            const avatarPublicId = `nestjsMoviedb/avatars/${profile.id}_${Date.now()}`;

            let cloudinaryAvatar = null;
            if (profile._json.avatar_url) {
                cloudinaryAvatar = await this.cloudinaryService.uploadFromUrl(
                    profile._json.avatar_url,
                    avatarPublicId,
                );
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(profile.id, salt);
            await this.prisma.user.create({
                data: {
                    email: emails[0].value,
                    name: displayName,
                    isEmailVerified: true,
                    githubId: profile.githubId,
                    password: hashedPassword,
                    //  refreshToken: accessToken,
                    avatar: {
                        create: {
                            url: cloudinaryAvatar.url,
                            publicId: cloudinaryAvatar.publicId,
                        },
                    },
                },
            });
        }

   

        return {
            email: emails[0].value,
            name: displayName || 'Unknown',
            avatar: profile._json.avatar_url,
            githubId: id,
            accessToken,
            refreshToken,
        };
    }
}
