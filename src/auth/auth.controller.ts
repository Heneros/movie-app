import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import express, { Response, Request } from 'express';

import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LogInDto } from './dto/login.dto';
import { TimeoutInterceptor } from '@/interceptor/timeout.interceptor';
import { UserEntity } from '@/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';
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
import { Context } from '@nestjs/graphql';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
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

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description:
      'The user has been successfully created. Check out your email to verify account',
    type: AuthEntity,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.create(createUserDto);
  }

  @Get('verify/:emailToken/:userId')
  @ApiOperation({ summary: 'Verify email. Enter id user and token' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully verified email.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid or expired token.',
  })
  async verifyEmail(@Param() verifyEmailDto: VerifyEmailDto) {
    await this.verifyEmailService.verifyEmail(verifyEmailDto);
  }

  // @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in. Only for verified accounts' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authorize',
    type: AuthEntity,
  })
  async login(
    @Body(EmailValidationPipe) logInDto: LogInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.loginAuthService.login(logInDto, req, res);
    return res.status(200).json({ message: 'Success', token });
    // return this.loginAuthService.login(logInDto, req, res);
  }

  @Post('/resend_email_token')
  @ApiOperation({ summary: 'Action to resend email and receive token' })
  @ApiResponse({
    status: 200,
    description: 'Email was successfully sent to user.',
    type: UserEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  resendEmailValidation(
    @Body(EmailValidationPipe) email: ResendEmailDto,
    @Res() res: Response,
  ) {
    return this.resendEmailService.resendEmailValidation(res, email);
  }

  @Post('/reset_password_request')
  @ApiOperation({
    summary: 'Request for users who wants receive in email to change password',
  })
  @ApiResponse({
    status: 200,
    description: 'On email was sent request to reset password',
    type: UserEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  requestResetPassword(
    @Body(EmailValidationPipe) email: ResendEmailDto,
    @Res() res: Response,
  ) {
    return this.requestResetPasswordService.requestResetPassword(res, email);
  }

  @Post('/reset_password')
  @ApiOperation({
    summary: 'For users, who receive link in email. And know user id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password was successfully reset!',
    type: AuthEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Actions specify new password and user id',
  })
  async resetPassword(
    @Body(EmailValidationPipe) resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    return this.resetPasswordService.resetPassword(res, resetPasswordDto);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Log out for application ',
  })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwtMovie');
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const result = await this.logoutAuthService.logout(req);
    return result;
  }
}
