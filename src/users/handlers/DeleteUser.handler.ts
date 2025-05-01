import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteUserCommand } from '../commands';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { deleteCache } from './FindAllUsers.handler';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly usersRepository: UsersRepository,
    ) {}

    async execute(command: DeleteUserCommand) {
        const { id } = command;

        const userIsAdmin = await this.usersRepository.findIdUser(id);
        if (!userIsAdmin) {
            throw new NotFoundException('No user found');
        }

        if (userIsAdmin.roles?.includes['Admin']) {
            throw new ForbiddenException(
                'Admin cannot delete their own account',
            );
        }

        await this.usersRepository.deleteUserAccount(id);

        // await deleteCache(this.cacheManager, 'users');
        // const redisClient = (this.cacheManager.stores as any).getClient();
        // const keys = await redisClient.keys('users:page:*');

        // await Promise.all(
        //     keys.map((key: string) => this.cacheManager.del(key)),
        // );
        // await this.cacheManager.del(`user:${id}`);

        return `User was deleted ${userIsAdmin.name}`;
    }
}
