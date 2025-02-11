import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

import { jwtConstants } from '../data/defaultData';
import { MailService } from '../mail/mail.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateUserService } from './services/createUser.service';
import { LoginAuthService } from './services/login.service';
import { VerifyEmailService } from './services/verifyEmail.service';
import { ResendEmailService } from './services/resendEmailValidation.service';
import { ResetPasswordService } from './services/resetPassword.service';
import { LogoutAuthService } from './services/logout.service';
import { RequestResetPasswordService } from './services/requestResetPassword.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  exports: [AuthModule],
  providers: [
    AuthService,
    SchedulerRegistry,
    MailService,
    CreateUserService,
    LoginAuthService,
    VerifyEmailService,
    ResendEmailService,
    ResetPasswordService,
    RequestResetPasswordService,
    LogoutAuthService,
  ],
})
export class AuthModule {}
