import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import express, { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { CreateUserService } from './services/createUser.service';
import { LoginAuthService } from './services/login.service';
import { VerifyEmailService } from './services/verifyEmail.service';
import { ResendEmailService } from './services/resendEmailValidation.service';
import { ResetPasswordService } from './services/resetPassword.service';
import {
  LogoutAuthService,
  RequestWithSession,
} from './services/logout.service';
import { RequestResetPasswordService } from './services/requestResetPassword.service';
import { AuthEntity } from './entity/auth.entity';
import { AuthBasicInput } from './input/auth.input';
import { LoginInput } from './input/verify.input';
import { Req, Res } from '@nestjs/common';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';
import { ResendEmailDto } from './dto/resend-email.dto';
import { BaseAuthInput } from './input/baseAuth.input';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserService: CreateUserService,
    private readonly loginAuthService: LoginAuthService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendEmailService: ResendEmailService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly logoutAuthService: LogoutAuthService,

    private readonly requestResetPasswordService: RequestResetPasswordService,
  ) {}

  @Mutation((returns) => AuthEntity, {
    description: 'Registration user',
  })
  async createUser(@Args('input') authInput: AuthBasicInput) {
    return await this.createUserService.create(authInput);
  }

  @Query((returns) => AuthEntity, {
    description: 'Verification user',
  })
  async verifyUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('emailToken', { type: () => String }) emailToken: string,
    // @Args('input') verifyUser: VerifyEmailInput,
  ) {
    return await this.verifyEmailService.verifyEmail({ userId, emailToken });
  }

  @Mutation((returns) => AuthEntity, {
    description: 'Login user',
  })
  async loginUser(
    @Args('input', EmailValidationPipe)
    loginInput: LoginInput,
    @Context() context,
  ) {
    return this.loginAuthService.login(loginInput, context.req, context.res);
  }

  @Mutation((returns) => AuthEntity, {
    description: 'Resend email to user',
  })
  resendEmail(
    @Args('email', EmailValidationPipe)
    resendEmailDto: ResendEmailDto,
    @Context() context,
  ) {
    return this.resendEmailService.resendEmailValidation(
      context.res,
      resendEmailDto,
    );
  }

  @Mutation((returns) => AuthEntity, {
    description:
      'Request for users who wants receive in email to change password',
  })
  async requestResetPassword(
    @Args('email', EmailValidationPipe)
    resendEmailDto: ResendEmailDto,
    @Context() context,
  ) {
    return await this.requestResetPasswordService.requestResetPassword(
      context.res,
      resendEmailDto,
    );
  }

  @Mutation((returns) => AuthEntity, {
    description:
      'For users, who receive link in email. And want to reset password',
  })
  resetPassword(
    @Args('data', EmailValidationPipe)
    resetPasswordDto: ResetPasswordDto,
    @Context() context,
  ) {
    return this.resetPasswordService.resetPassword(
      context.res,
      resetPasswordDto,
    );
  }

  @Mutation(() => String, { description: 'Logout user' })
  async logout(@Context() context): Promise<string> {
    // Handle cookies directly in the resolver
    if (context.res && typeof context.res.clearCookie === 'function') {
      context.res.clearCookie('jwtMovie');
      context.res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    const result = await this.logoutAuthService.logout(context.req);
    return result.message;
  }
}
