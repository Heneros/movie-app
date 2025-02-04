import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LogInDto } from './dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { TimeoutInterceptor } from '../interceptor/timeout.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthRegister } from './entity/register.entity';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    status: 201,
    description:
      'The user has been successfully created. Check out your email to verify account',
    // type: UserEntity,
    type: AuthEntity,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Get('verify/:emailToken/:userId')
  @ApiOperation({ summary: 'Verify email. Enter id user and token' })
  @ApiCreatedResponse({
    status: 200,
    description: 'The user has been successfully verified email.',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Invalid or expired token.',
  })
  async verifyEmail(
    @Param() verifyEmailDto: VerifyEmailDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.verifyEmail(verifyEmailDto);
      return res.status(200).send({ message: 'Email successfully verified!' });
    } catch (error) {
      if (error instanceof NotFoundException || BadRequestException) {
        return res.status(404).send({ message: error.message });
      }
      return res.status(500).send({ message: 'An unexpected error occurred' });
    }
  }

  // @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in. Only for verified accounts' })
  @ApiCreatedResponse({
    status: 200,
    description: 'User successfully authorize',
    type: AuthRegister,
  })
  login(
    @Body(EmailValidationPipe) logInDto: LogInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.login(logInDto, req, res);
  }

  @Post('/resend_email_token')
  @ApiOperation({ summary: 'Action to resend email and receive token' })
  @ApiCreatedResponse({
    status: 200,
    description: 'Email was successfully sent to user.',
    type: UserEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  resendEmailValidation(@Body() email: ResendEmailDto) {
    return this.authService.resendEmailValidation(email);
  }

  @Post('/reset_password_request')
  @ApiOperation({
    summary: 'Request for users who wants receive in email to change password',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'On email was sent request to reset password',
    type: UserEntity,
  })
  @ApiOkResponse({ type: AuthEntity })
  requestResetPassword(
    @Body(EmailValidationPipe) email: ResendEmailDto,
    @Res() res: Response,
  ) {
    return this.authService.requestResetPassword(res, email);
  }

  @Post('/reset_password')
  @ApiOperation({
    summary: 'For users, who receive link in email. And know user id.',
  })
  @ApiCreatedResponse({
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
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Log out for application ',
  })
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
