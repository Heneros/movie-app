import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import bcrypt from 'bcrypt';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { HandleIOauth } from '../services';
import { AuthRepository } from '../repositories/Auth.repository';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly config: ConfigService,
        private readonly handleIOauth: HandleIOauth,
        private readonly authRepository: AuthRepository,
    ) {
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.get('GOOGLE_CALLBACK_URL'),
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // callbackURL: 'http://localhost:3000/auth/google/callback',
            // passReqToCallback: true,
            proxy: true,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const { displayName, emails, photos, id } = profile;
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
        console.log(profile);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.id, salt);

        const userData = {
            providerId: id,
            email,
            name: displayName,
            provider: profile.provider,
            password: hashedPassword,
            avatarUrl: profile._json.picture,
        };

        // console.log({ userData });

        await this.handleIOauth.createUserViaOauth({
            ...userData,
        });
        return {
            email: emails[0].value,
            name: displayName,
            avatar: photos?.[0]?.value,
            googleId: id,
            accessToken,
        };
    }
}
