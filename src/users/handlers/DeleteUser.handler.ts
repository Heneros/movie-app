import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    ForbiddenException,
    Inject,
    LoggerService,
    NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteUserCommand } from '../commands';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly usersRepository: UsersRepository,
    ) {}

    async execute(command: DeleteUserCommand) {
        const { id } = command;

        this.logger.log(`Delete user ${id}`);


        const userIsAdmin = await this.usersRepository.findIdUser(+id);
        if (!userIsAdmin) {
            return new NotFoundException('No user found');
        }

        if (userIsAdmin?.roles?.includes('Admin')) {
            // console.log(5555);
            return new ForbiddenException(
                'Admin cannot delete their own account',
            );
        }
        // console.log({ userIsAdmin });
        await this.usersRepository.deleteUserAccount(id);

        await this.cacheManager.del(`${RedisPrefixEnum.USERS}:${id}`);


        return `User was deleted ${userIsAdmin.name}`;
    }
}
