import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
import { LogInDto } from './dto/Login.dto';
import { TimeoutInterceptor } from '@/interceptor/timeout.interceptor';
import { UserEntity } from '@/users/entities/user.entity';
import { CreateUserDto } from './dto/Create-user.dto';
import { VerifyEmailDto } from './dto/Verify-email.dto';
import { ResetPasswordDto } from './dto/Reset-password.dto';
import { AuthRegister } from './entity/register.entity';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';
import { CreateUserService } from './services/createUser.service';
import { LoginAuthService } from './services/login.service';
import { VerifyEmailService } from './services/verifyEmail.service';
import { ResendEmailService } from './services/resendEmailValidation.service';
import { ResetPasswordService } from './services/resetPassword.service';
import { LogoutAuthService } from './services/logout.service';
import { RequestResetPasswordService } from './services/requestResetPassword.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthRepository } from './repositories/Auth.repository';
import {
    CreateUserCommand,
    LoginUserCommand,
    ResendEmailCommand,
} from './commands/index';

import { CustomRequest } from '@/types/cus-request';
import { AUTH_CONTROLLER, AUTH_ROUTES } from '@/sites/site.constants';
import { VerifyEmailQuery } from './queries';
import { EmailDto } from './dto/Resend-email.dto';

@Controller(AUTH_CONTROLLER)
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

        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly authRepository: AuthRepository,
    ) {}

    @Post(AUTH_ROUTES.REGISTER)
    @ApiOperation({ summary: 'Create user' })
    @ApiCreatedResponse({
        description:
            'The user has been successfully created. Check out your email to verify account',
        type: AuthEntity,
    })
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.commandBus.execute(
            new CreateUserCommand(createUserDto),
        );
    }

    @Get(AUTH_ROUTES.VERIFY)
    @ApiOperation({ summary: 'Verify email. Enter id user and token' })
    @ApiCreatedResponse({
        description: 'The user has been successfully verified email.',
        type: UserEntity,
    })
    @ApiNotFoundResponse({
        description: 'Invalid or expired token.',
    })
    async verifyEmail(
        @Param('emailToken') token: string,
        @Param('userId') userId: number,
        @Res() res: Response,
    ) {
        return await this.queryBus.execute(
            new VerifyEmailQuery(token, userId, res),
        );
    }

    @Post(AUTH_ROUTES.LOGIN)
    @ApiOperation({ summary: 'Log in. Only for verified accounts' })
    @ApiCreatedResponse({
        description: 'User successfully authorize',
        type: AuthRegister,
    })
    async login(
        @Req() req: CustomRequest,
        @Res() res: Response,
        @Body(EmailValidationPipe) logInDto: LogInDto,
    ) {
        return this.commandBus.execute(
            new LoginUserCommand(req, res, logInDto),
        );
    }

    @Post(AUTH_ROUTES.RESEND_EMAIL)
    @ApiOperation({ summary: 'Action to resend email to receive token' })
    @ApiCreatedResponse({
        description: 'Email was successfully sent to user.',
        type: UserEntity,
    })
    @ApiOkResponse({ type: AuthEntity })
    async resendEmailValidation(
        @Param('userId')
        userId: number,
        @Body()
        email: EmailDto,
        @Res() res: Response,
    ) {
        return await this.commandBus.execute(
            new ResendEmailCommand(userId, email, res),
        );
    }

    @Post(AUTH_ROUTES.RESET_PASSWORD_REQUEST)
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
        @Body(EmailValidationPipe) email: EmailDto,
        @Res() res: Response,
    ) {
        return this.requestResetPasswordService.requestResetPassword(
            res,
            email,
        );
    }

    @Post(AUTH_ROUTES.RESET_PASSWORD)
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
        @Param('userId', ParseIntPipe) userId: number,
        @Body(EmailValidationPipe) resetPasswordDto: ResetPasswordDto,
        @Res() res: Response,
    ) {
        return this.resetPasswordService.resetPassword(res, resetPasswordDto);
    }

    @Post(AUTH_ROUTES.LOGOUT)
    @ApiOperation({
        summary: 'Log out for application ',
    })
    logout(@Req() req: Request, @Res() res: Response) {
        return this.logoutAuthService.logout(req, res);
    }
}
