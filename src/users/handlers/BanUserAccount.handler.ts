import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { BanUserAccountCommand } from '../commands';

@CommandHandler(BanUserAccountCommand)
export class BanUserAccountHandler
    implements ICommandHandler<BanUserAccountCommand>
{
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(command: BanUserAccountCommand) {
        const { id } = command;

        const userIsAdmin = await this.usersRepository.findIdUser(id);
        if (!userIsAdmin) {
            throw new NotFoundException('No user found');
        }

        if (userIsAdmin.roles?.includes('Admin')) {
            throw new ForbiddenException('Admin cannot ban their own account');
        }

        await this.usersRepository.banUserAccount(id);

        return `User was banned ${userIsAdmin.name}`;
    }
}
