import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';

import { jwtConstants } from '@/data/defaultData';
import { MailService } from '@/mail/mail.service';
import { AuthResolver } from './auth.resolver';

import {
    CreateUserHandler,
    LoginUserHandler,
    LogoutHandler,
    ResendEmailHandler,
    ResetPasswordHandler,
    ResetPasswordRequestHandler,
    VerifyEmailHandler,
} from './handlers/index';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './repositories/Auth.repository';
import { GoogleStrategy } from './passport/GoogleStrategy';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { DiscordService, GithubService, GoogleService } from './services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GithubStrategy } from './passport/GithubStrategy';
import { HandleIOauth } from './services/HandleIOauth.service';
import { DiscordStrategy } from './passport/DiscordStrategy';

@Module({
    controllers: [AuthController],
    exports: [AuthModule],
    providers: [
        AuthService,
        GoogleService,
        GoogleStrategy,
        GithubService,
        GithubStrategy,
        CloudinaryService,
        HandleIOauth,
        DiscordService,
        DiscordStrategy,

        MailService,
        AuthRepository,
        LoginUserHandler,
        CreateUserHandler,
        VerifyEmailHandler,
        ResendEmailHandler,
        ResetPasswordRequestHandler,
        ResetPasswordHandler,
        LogoutHandler,
        AuthResolver,
    ],
    imports: [
        ConfigModule,
        PrismaModule,
        CqrsModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '31d' },
        }),
        UsersModule,
    ],
})
export class AuthModule {}
