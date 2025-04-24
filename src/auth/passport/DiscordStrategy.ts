import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-discord';
import { AuthRepository } from '../repositories/Auth.repository';
import { HandleIOauth } from '../services';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly prisma: PrismaService,
        private readonly handleIOauth: HandleIOauth,
        private readonly cloudinaryService: CloudinaryService,

        config: ConfigService,
    ) {
        super({
            clientID: config.get('DISCORD_CLIENT_ID'),
            clientSecret: config.get('DISCORD_CLIENT_SECRET'),
            callbackURL: config.get('DISCORD_CALLBACK_URI'),
            // proxy: true,
            scope: ['identify', 'email'],
            // scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const { global_name, email, id, provider, avatar } = profile;

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.id, salt);

        const userData = {
            providerId: id,
            email,
            name: global_name,
            provider: provider,
            password: hashedPassword,
            avatarUrl: avatar || '',
        };

        // console.log({ userData });
        await this.handleIOauth.createUserViaOauth({
            ...userData,
        });

        return {
            email: email,
            name: global_name,
            avatar: avatar || '',
            discordId: id,
            accessToken,
            refreshToken,
        };

        // console.log(profile);
    }
}
