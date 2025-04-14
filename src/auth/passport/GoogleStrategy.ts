import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private config: ConfigService) {
        super({
            // clientID: config.get('GOOGLE_CLIENT_ID'),
            // clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            // callbackURL: config.get('GOOGLE_CALLBACK_URL'),
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos, id } = profile;

        // console.log({ profile });

        const user = {
            email: emails[0].value,
            name: name.givenName,
            avatar: photos[0].value,
            googleId: id,
        };

        done(null, user);
    }
}
