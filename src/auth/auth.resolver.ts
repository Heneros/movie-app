import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthEntity } from './entity/auth.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LogInDto } from './dto/Login.dto';
import { LoginUserCommand } from './commands';
import { Request, Response } from 'express';
import { AuthRepository } from './repositories/Auth.repository';
import { Throttle } from '@nestjs/throttler';
import { isDevelopment } from '@/data/defaultData';

@Resolver((of) => AuthEntity)
export class AuthResolver {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Mutation(() => AuthEntity, {
        description: 'Login in',
    })
    async login(
        @Context() context: { req: Request; res: Response },
        @Args('input') loginInput: LogInDto,
    ) {
        const { res } = context;
        const result = await this.commandBus.execute(
            new LoginUserCommand(loginInput),
        );
        console.log(result);

        res.cookie('jwtMovie', result.refreshToken, {
            httpOnly: !isDevelopment,
            sameSite: isDevelopment ? 'none' : 'strict',
            maxAge: 31 * 24 * 60 * 60 * 1000,
            secure: !isDevelopment,
        });
        console.log(result);
        return new AuthEntity({
            message: 'Login successful',
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            name: result.user.name,
            id: result.user.id,
            email: result.user.email,
        });
        // const { req, res } = context;
        // return await this.commandBus.execute(new LoginUserCommand(loginInput));
    }
}
