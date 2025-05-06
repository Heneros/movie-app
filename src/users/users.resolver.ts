import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/guards/auth.guard';
import { CheckUserExistPipe } from './pipe/CheckUserExist.pipe';
import { ProfileOwnerGuard } from '@/guards/ProfileOwner.guard';
import { UpdateUserDto } from './dto-input/update-user.dto';
import { DeleteUserCommand, UpdateUserCommand } from './commands';

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
    async findAllUsers(@Args('page') page: number) {
        const users = await this.queryBus.execute(new FindAllUsersQuery(page));
        return plainToInstance(UserEntity, users);
    }

    @UseGuards(AuthGuard)
    @Roles('Admin')
    @Query(() => [UserEntity], {
        description: 'Return all blocked users',
    })
    async findAllBlocked(
        @Args('page') page: number,
    ): Promise<[UserEntity] | null> {
        return await this.queryBus.execute(new GetAllBlockedUsersQuery(page));
    }

    @UseGuards(AuthGuard)
    @Query(() => UserEntity, {
        description: 'Get User by id',
    })
    async findIdUser(
        @Args('id', CheckUserExistPipe) id: number,
    ): Promise<UserEntity | null> {
        const user = await this.queryBus.execute(new GetIdUserQuery(id));
        return plainToInstance(UserEntity, user);
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Mutation(() => UserEntity, {
        description: 'Get User by id',
    })
    async updateUser(
        @Args('id', CheckUserExistPipe) id: number,
        @Args('updateUserDto') updateUserDto: UpdateUserDto,
    ): Promise<UserEntity | null> {
        const result = await this.commandBus.execute(
            new UpdateUserCommand(id, updateUserDto),
        );
        return plainToInstance(UserEntity, result);
    }

    @UseGuards(AuthGuard)
    @Roles('Admin')
    @Mutation(() => UserEntity, {
        description: 'Delete User by id',
    })
    async deleteUser(
        @Args('id', CheckUserExistPipe, ParseIntPipe) id: number,
    ): Promise<UserEntity | null> {
        const result = await this.commandBus.execute(new DeleteUserCommand(id));
        return result;
    }
}
