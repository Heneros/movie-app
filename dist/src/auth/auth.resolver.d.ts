import { AuthEntity } from './entity-objectType/auth.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LogInDto } from './dto-input/Login.dto';
import { Request, Response } from 'express';
import { AuthRepository } from './repositories/Auth.repository';
import { PubSub } from 'graphql-subscriptions';
import { CreateUserDto } from './dto-input/Create-user.dto';
import { EmailDto } from './dto-input/Resend-email.dto';
import { ResetPasswordDto } from './dto-input/Reset-password.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthResolver {
    private readonly authRepository;
    private readonly commandBus;
    private readonly queryBus;
    private jwt;
    pubSub: PubSub;
    constructor(authRepository: AuthRepository, commandBus: CommandBus, queryBus: QueryBus, jwt: JwtService);
    login(context: {
        req: Request;
        res: Response;
    }, loginInput: LogInDto): Promise<AuthEntity>;
    userLogInSubscribe(): Promise<import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>>;
    createUser(createUserDto: CreateUserDto): Promise<any>;
    verifyEmail(token: string, userId: number): Promise<any>;
    resendEmail(userId: number, emailDto: EmailDto): Promise<AuthEntity>;
    requestResetPassword(userId: number, emailDto: EmailDto, context: {
        res: Response;
    }): Promise<any>;
    resetPassword(userId: number, token: string, resetPasswordDto: ResetPasswordDto): Promise<any>;
    logout(context: {
        res: Response;
        req: Request;
    }): Promise<any>;
}
