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
    ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LogInDto } from './dto/login.dto';
import { Public } from '@/decorators/public.decorator';
import { TimeoutInterceptor } from '@/interceptor/timeout.interceptor';
import { UserEntity } from '@/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthRegister } from './entity/register.entity';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';
import { CreateUserService } from './services/createUser.service';
import { LoginAuthService } from './services/login.service';
import { VerifyEmailService } from './services/verifyEmail.service';
import { ResendEmailService } from './services/resendEmailValidation.service';
import { ResetPasswordService } from './services/resetPassword.service';
import { LogoutAuthService } from './services/logout.service';
import { RequestResetPasswordService } from './services/requestResetPassword.service';

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

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Create user' })
    @ApiCreatedResponse({
        description:
            'The user has been successfully created. Check out your email to verify account',
        type: AuthEntity,
    })
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        return await this.createUserService.create(res, createUserDto);
    }

    @Get('verify/:emailToken/:userId')
    @ApiOperation({ summary: 'Verify email. Enter id user and token' })
    @ApiCreatedResponse({
        description: 'The user has been successfully verified email.',
        type: UserEntity,
    })
    @ApiNotFoundResponse({
        description: 'Invalid or expired token.',
    })
    async verifyEmail(
        @Param() verifyEmailDto: VerifyEmailDto,
        @Res() res: Response,
    ) {
        await this.verifyEmailService.verifyEmail(res, verifyEmailDto);
        // try {
        //
        //   return res.status(200).send({ message: 'Email successfully verified!' });
        // } catch (error) {
        //   if (error instanceof NotFoundException || BadRequestException) {
        //     return res.status(404).send({ message: error.message });
        //   }
        //   return res.status(500).send({ message: 'An unexpected error occurred' });
        // }
    }

    // @Public()
    @Post('login')
    @ApiOperation({ summary: 'Log in. Only for verified accounts' })
    @ApiCreatedResponse({
        description: 'User successfully authorize',
        type: AuthRegister,
    })
    login(
        @Body(EmailValidationPipe) logInDto: LogInDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.loginAuthService.login(logInDto, req, res);
    }

    @Post('/resend_email_token')
    @ApiOperation({ summary: 'Action to resend email and receive token' })
    @ApiCreatedResponse({
        description: 'Email was successfully sent to user.',
        type: UserEntity,
    })
    @ApiOkResponse({ type: AuthEntity })
    resendEmailValidation(@Body() email: ResendEmailDto, @Res() res: Response) {
        return this.resendEmailService.resendEmailValidation(res, email);
    }

    @Post('/reset_password_request')
    @ApiOperation({
        summary:
            'Request for users who wants receive in email to change password',
    })
    @ApiCreatedResponse({
        description: 'On email was sent request to reset password',
        type: UserEntity,
    })
    @ApiOkResponse({ type: AuthEntity })
    requestResetPassword(
        @Body(EmailValidationPipe) email: ResendEmailDto,
        @Res() res: Response,
    ) {
        return this.requestResetPasswordService.requestResetPassword(
            res,
            email,
        );
    }

    @Post('/reset_password')
    @ApiOperation({
        summary: 'For users, who receive link in email. And know user id.',
    })
    @ApiCreatedResponse({
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
    logout(@Req() req: Request, @Res() res: Response) {
        return this.logoutAuthService.logout(req, res);
    }
}
