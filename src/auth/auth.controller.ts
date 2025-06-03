import {
    BadGatewayException,
    BadRequestException,
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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity-objectType/auth.entity';
import { LogInDto } from './dto-input/Login.dto';
import { TimeoutInterceptor } from '@/interceptor/timeout.interceptor';
import { UserEntity } from '@/users/entities-objectType/user.entity';
import { CreateUserDto } from './dto-input/Create-user.dto';
import { ResetPasswordDto } from './dto-input/Reset-password.dto';
import { AuthRegister } from './entity-objectType/register.entity';
import { EmailValidationPipe } from './pipe/EmailValidation.pipe';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
    CreateUserCommand,
    LoginUserCommand,
    LogoutCommand,
    ResendEmailCommand,
    ResetPasswordCommand,
    ResetPasswordRequestCommand,
} from './commands/index';

import { CustomRequest } from '@/types/cus-request';
import { AUTH_CONTROLLER, AUTH_ROUTES } from '@/sites/site.constants';
import { VerifyEmailQuery } from './queries';
import { EmailDto } from './dto-input/Resend-email.dto';
import { Throttle } from '@nestjs/throttler';
import { isDevelopment } from '@/data/defaultData';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { DiscordService, GithubService, GoogleService } from './services';

@Controller(AUTH_CONTROLLER)
@ApiTags('Auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly googleService: GoogleService,
        private readonly githubService: GithubService,
        private readonly discordService: DiscordService,
        private jwt: JwtService,
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

    // @Throttle({ default: { limit: 15, ttl: 60000 } })
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
        // @Res({ passthrough: true }) res: Response,
    ) {
        return await this.queryBus.execute(new VerifyEmailQuery(token, userId));

        // return res.status(200).json({ message: 'Your email is verified!' });
    }

    @Post(AUTH_ROUTES.LOGIN)
    @ApiOperation({ summary: 'Log in. Only for verified accounts' })
    @ApiCreatedResponse({
        description: 'User successfully authorize',
        type: AuthRegister,
    })
    async login(
        @Req() req: CustomRequest,
        @Res({ passthrough: true }) res: Response,
        @Body(EmailValidationPipe) logInDto: LogInDto,
    ) {

        try {
            const result = await this.commandBus.execute(
                new LoginUserCommand(logInDto),
            );

   
            res.cookie('jwtMovie', result.refreshToken, {
                httpOnly: !isDevelopment,
                sameSite: isDevelopment ? 'none' : 'strict',
                maxAge: 31 * 24 * 60 * 60 * 1000,
                secure: !isDevelopment,
            });

            return new AuthEntity({
                message: 'Login successful',
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                name: result.user.name,
                id: result.user.id,
                email: result.user.email,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadGatewayException(
                error.message || 'Authentication failed',
            );
        }
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
        emailDto: EmailDto,
    ) {
        const result = await this.commandBus.execute(
            new ResendEmailCommand(userId, emailDto.email),
        );
        return new AuthEntity(result);
    }

    @Throttle({ default: { limit: 15, ttl: 60000 } })
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
    async requestResetPassword(
        @Param('userId') userId: number,
        @Body(EmailValidationPipe) emailDto: EmailDto,
        @Res() res: Response,
    ) {
        return await this.commandBus.execute(
            new ResetPasswordRequestCommand(userId, emailDto.email, res),
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
        @Query('userId', ParseIntPipe) userId: number,
        @Query('emailToken') emailToken: string,
        @Body() resetPasswordDto: ResetPasswordDto,
        // @Res() res: Response,
    ) {
        return await this.commandBus.execute(
            new ResetPasswordCommand(userId, emailToken, resetPasswordDto),
        );
    }

    @Post(AUTH_ROUTES.LOGOUT)
    @ApiResponse({
        status: 302,
        description: 'Log out successfully',
    })
    @ApiOperation({
        summary: 'Log out for application ',
    })
    async logout(@Req() req: Request, @Res() res: Response) {
        const message = await this.commandBus.execute(
            new LogoutCommand(req, res),
        );
        res.status(200).json({ message });
    }

    @Get(AUTH_ROUTES.GOOGLE)
    @ApiOperation({
        summary: 'Google log in for application ',
    })
    @ApiResponse({
        status: 302,
        description: 'Redirects to Google OAuth login',
    })
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get(AUTH_ROUTES.GOOGLE_CALLBACK)
    @ApiOperation({ summary: 'Callback from Google OAuth' })
    @ApiResponse({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    })
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        try {
            const user = await this.googleService.validateGoogleUser(req.user);

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });

            return res
                .cookie('jwtMovie', token, {
                    httpOnly: true,
                    sameSite: !isDevelopment ? 'lax' : 'strict',
                    maxAge: 31 * 24 * 60 * 60 * 1000,
                    secure: !isDevelopment,
                })
                .redirect('/');
        } catch (error) {
            console.error('Google Auth Error:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadGatewayException(
                error.message || 'Authentication failed',
            );
        }
    }

    @Get(AUTH_ROUTES.GITHUB)
    @UseGuards(AuthGuard('github'))
    @ApiOperation({
        summary: 'Github log in for application ',
    })
    @ApiResponse({
        status: 302,
        description: 'Redirects to Github OAuth login',
    })
    githubAuth() {
        // console.log(123);
    }

    @Get(AUTH_ROUTES.GITHUB_CALLBACK)
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'Callback from Github OAuth' })
    @ApiResponse({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    })
    async githubAuthCallback(@Req() req, @Res() res: Response) {
        try {
            const user = await this.githubService.validateGithubUser(req.user);

            // console.log(user, 12343434)
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });
            res.cookie('jwtMovie', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).redirect('/');
        } catch (error) {
            res.redirect('/auth-error');
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadGatewayException(
                error.message || 'Authentication failed',
            );
        }
    }

    @Get(AUTH_ROUTES.DISCORD)
    @UseGuards(AuthGuard('discord'))
    @ApiOperation({
        summary: 'Discord log in for application ',
    })
    @ApiResponse({
        status: 302,
        description: 'Redirects to Discord OAuth login',
    })
    discordAuth() {
        // console.log(123);
    }

    @Get(AUTH_ROUTES.DISCORD_CALLBACK)
    @UseGuards(AuthGuard('discord'))
    @ApiOperation({ summary: 'Callback from Discord OAuth' })
    @ApiResponse({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    })
    async discordAuthCallback(@Req() req, @Res() res: Response) {
        try {
            const user = await this.discordService.validateDiscordUser(
                req.user,
            );

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });
            res.cookie('jwtMovie', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).redirect('/');
        } catch (error) {
            // res.redirect('/auth-error');
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadGatewayException(
                error.message || 'Authentication failed',
            );
        }
    }
}
