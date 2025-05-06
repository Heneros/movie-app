import { Args, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
    FindAllUsersQuery,
    GetAllBlockedUsersQuery,
    GetIdUserQuery,
} from './queries';
import { plainToInstance } from 'class-transformer';
import { Roles } from '@/decorators/roles.decorator';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/guards/auth.guard';
import { User } from '@prisma/client';
import { CheckUserExistPipe } from './pipe/CheckUserExist.pipe';

@ApiTags('Users')
@Resolver((of) => UserEntity)
export class UsersResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @Query(() => [UserEntity], {
        description: 'Return all users',
    })
    async findAllUsers(@Args('page') page: number): Promise<UserEntity | null> {
        const users = await this.queryBus.execute(new FindAllUsersQuery(page));
        return plainToInstance(UserEntity, users);
    }

    @UseGuards(AuthGuard)
    @Roles('Admin')
    @Query(() => [UserEntity], {
        description: 'Return all blocked users',
    })
    async findAllBlocked(@Args('page') page: number) {
        return await this.queryBus.execute(new GetAllBlockedUsersQuery(page));
    }

    @UseGuards(AuthGuard)
    @Query(() => UserEntity, {
        description: 'Get User by id',
    })
    async findIdUser(@Args('id', CheckUserExistPipe) id: number) {
        const user = await this.queryBus.execute(new GetIdUserQuery(id));
        return plainToInstance(UserEntity, user);
    }
}
