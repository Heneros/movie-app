import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { DeactivateUserAccountCommand } from '../commands';

@CommandHandler(DeactivateUserAccountCommand)
export class DeactivateUserAccount
    implements ICommandHandler<DeactivateUserAccountCommand>
{
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(command: DeactivateUserAccountCommand) {
        const { id } = command;

        const userIsAdmin = await this.usersRepository.findIdUser(id);
        if (!userIsAdmin) {
            throw new NotFoundException('No user found');
        }

        if (!userIsAdmin) {
            throw new ForbiddenException('User not found');
        }

        if (userIsAdmin.roles?.includes['Admin']) {
            throw new ForbiddenException(
                'Admin cannot delete their own account',
            );
        }

        await this.usersRepository.deactivate(id);

        return `User was deactivated ${userIsAdmin.name}`;
    }
}
