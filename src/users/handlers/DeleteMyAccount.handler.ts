import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteMyAccountCommand, DeleteUserCommand } from '../commands';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@CommandHandler(DeleteMyAccountCommand)
export class DeleteMyAccountHandler
    implements ICommandHandler<DeleteMyAccountCommand>
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly usersRepository: UsersRepository,
    ) {}

    async execute(command: DeleteMyAccountCommand) {
        const { id } = command;

        const userIsAdmin = await this.usersRepository.findIdUser(id);
        if (!userIsAdmin) {
            throw new NotFoundException('No user found');
        }

        if (!userIsAdmin) {
            throw new ForbiddenException('User not found');
        }

        // if (userIsAdmin.roles?.includes['Admin']) {
        if (userIsAdmin?.roles?.includes('Admin')) {
            throw new ForbiddenException(
                'Admin cannot delete their own account',
            );
        }

        await this.usersRepository.deleteUserAccount(id);

        return `${userIsAdmin.name} was deleted `;
    }
}
