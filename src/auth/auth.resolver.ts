import {
    Args,
    Context,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { AuthEntity } from './entity/auth.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LogInDto } from './dto-input/Login.dto';
import {
    CreateUserCommand,
    LoginUserCommand,
    LogoutCommand,
    ResendEmailCommand,
    ResetPasswordCommand,
    ResetPasswordRequestCommand,
} from './commands';
import { Request, Response } from 'express';
import { AuthRepository } from './repositories/Auth.repository';
import { Throttle } from '@nestjs/throttler';
import { isDevelopment } from '@/data/defaultData';
import { PubSub } from 'graphql-subscriptions';

import { CreateUserDto } from './dto-input/Create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyEmailQuery } from './queries';
import { EmailDto } from './dto-input/Resend-email.dto';
import { ResetPasswordDto } from './dto-input/Reset-password.dto';
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { OAuthUrl } from './../types/auth.types';

@ApiTags('Auth')
@Resolver((of) => AuthEntity)
export class AuthResolver {
    public pubSub: PubSub;
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        this.pubSub = new PubSub();
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Mutation(() => AuthEntity, {
        description: 'Login in',
    })
    @ApiOperation({
        summary: 'Login user',
        description: 'Authenticate user and return JWT tokens',
    })
    async login(
        @Context() context: { req: Request; res: Response },
        @Args('input') loginInput: LogInDto,
    ) {
        const { res } = context;
        const result = await this.commandBus.execute(
            new LoginUserCommand(loginInput),
        );

        if (!result) {
            throw new BadRequestException('No user found');
        }
        res.cookie('jwtMovie', result.refreshToken, {
            httpOnly: !isDevelopment,
            sameSite: isDevelopment ? 'none' : 'strict',
            maxAge: 31 * 24 * 60 * 60 * 1000,
            secure: !isDevelopment,
        });

        this.pubSub.publish('AUTH_LOGIN_SUBSCRIBE', {
            userLogInSubscribe: result.user,
        });

        return new AuthEntity({
            message: 'Login successful',
            accessToken: result.accessToken,
            name: result.user.name,
            id: result.user.id,
            email: result.user.email,
        });
    }

    @Subscription(() => AuthEntity, {
        name: 'userLogInSubscribe',
        resolve: (payload) => {
            return payload.userLogInSubscribe;
        },
    })
    async userLogInSubscribe() {
        return this.pubSub.asyncIterableIterator('AUTH_LOGIN_SUBSCRIBE');
    }

    @Mutation(() => AuthEntity, { description: 'Registration user' })
    async createUser(@Args('input') createUserDto: CreateUserDto) {
        return await this.commandBus.execute(
            new CreateUserCommand(createUserDto),
        );
    }

    @Query(() => AuthEntity, {
        description: 'Verify email. Enter token user and id',
    })
    async verifyEmail(
        @Args('emailToken') token: string,
        @Args('userId') userId: number,
    ) {
        return await this.queryBus.execute(new VerifyEmailQuery(token, userId));
    }

    @Mutation(() => AuthEntity, { description: 'Resend Email' })
    async resendEmail(
        @Args('userId') userId: number,
        @Args('email') emailDto: EmailDto,
        // @Context() context: { res: Response },
    ) {
        // const { res } = context;
        return new AuthEntity(
            await this.commandBus.execute(
                new ResendEmailCommand(userId, emailDto.email),
            ),
        );
    }
    @Mutation(() => AuthEntity, {
        description: 'For users, who receive link in email. And know user id.',
    })
    async requestResetPassword(
        @Args('userId', ParseIntPipe) userId: number,
        @Args('email') emailDto: EmailDto,
        @Context() context: { res: Response },
    ) {
        const { res } = context;
        return await this.commandBus.execute(
            new ResetPasswordRequestCommand(userId, emailDto.email, res),
        );
    }

    @Mutation(() => AuthEntity, {
        description: 'For users, who receive link in email. And know user id.',
    })
    async resetPassword(
        @Args('userId', ParseIntPipe) userId: number,
        @Args('emailToken') emailToken: string,
        @Args('input') resetPasswordDto: ResetPasswordDto,
        @Context() context: { res: Response },
    ) {
        const { res } = context;
        return await this.commandBus.execute(
            new ResetPasswordCommand(userId, emailToken, resetPasswordDto, res),
        );
    }

    @Mutation(() => String, {
        description: 'Log out for application',
    })
    async logout(@Context() context: { res: Response; req: Request }) {
        return await this.commandBus.execute(
            new LogoutCommand(context.req, context.res),
        );
    }

    @Query(() => String)
    googleAuthUrl() {
        return { url: 'http://localhost:3000/auth/google' };
    }

    @Query(() => String)
    githubAuthUrl() {
        return { url: 'http://localhost:3000/auth/github' };
    }

    @Query(() => String)
    discordAuthUrl() {
        return { url: 'http://localhost:3000/auth/discord' };
    }

    
}
