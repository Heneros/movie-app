import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteUserCommand } from '../commands';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(command: DeleteUserCommand) {
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

        await this.usersRepository.deleteUserAccount(id);

        return `User was deleted ${userIsAdmin.name}`;
    }
}
