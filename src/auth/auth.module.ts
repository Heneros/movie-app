import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';

import { jwtConstants } from '@/data/defaultData';
import { MailService } from '@/mail/mail.service';

import { CreateUserService } from './services/createUser.service';
import { LoginAuthService } from './services/login.service';
import { VerifyEmailService } from './services/verifyEmail.service';
import { ResendEmailService } from './services/resendEmailValidation.service';
import { ResetPasswordService } from './services/resetPassword.service';
import { LogoutAuthService } from './services/logout.service';
import { RequestResetPasswordService } from './services/requestResetPassword.service';
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

@Module({
    controllers: [AuthController],
    exports: [AuthModule],
    providers: [
        AuthService,

        CreateUserService,
        LoginAuthService,
        VerifyEmailService,
        ResendEmailService,
        ResetPasswordService,
        RequestResetPasswordService,
        LogoutAuthService,

        
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
