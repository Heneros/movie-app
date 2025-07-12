import { UserEntity } from './entities-objectType/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateUserDto } from './dto-input/update-user.dto';
import { UpdateUserRole } from './dto-input/update-user-role.dto';
import { PubSub } from 'graphql-subscriptions';
export declare class UsersResolver {
    private readonly commandBus;
    private readonly queryBus;
    readonly pubSub: PubSub;
    constructor(commandBus: CommandBus, queryBus: QueryBus, pubSub: PubSub);
    findAllUsers(page: number): Promise<UserEntity>;
    findAllBlocked(page: number): Promise<[UserEntity] | null>;
    findIdUser(id: number): Promise<UserEntity | null>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | null>;
    deleteUser(id: number): Promise<UserEntity | null>;
    changeRole(id: number, updateUserRole: UpdateUserRole): Promise<UserEntity | null>;
    userChangeRoleSubscribe(): Promise<import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>>;
    findUser(id: number): Promise<any>;
    movies(user: UserEntity): Promise<any>;
}
