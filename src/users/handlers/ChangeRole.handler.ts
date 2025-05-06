import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { ChangeRoleCommand } from '../commands';

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleHandler implements ICommandHandler<ChangeRoleCommand> {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(command: ChangeRoleCommand) {
        const { id, updateUserRoleDto } = command;

        const user = await this.usersRepository.findIdUser(id);
        if (!user) {
            throw new NotFoundException('No user found');
        }

        if (user.roles?.includes('Admin')) {
            throw new ForbiddenException('Admin cannot change their own role');
        }

        // user.roles = updateUserRoleDto.roles;
        // const updatedRoles = Array.from(
        //     new Set([...user.roles, ...updateUserDto.roles]),
        // );
        // const updatedRoles = Array.from(new Set([...updateUserRoleDto.roles]));

        return await this.usersRepository.updateUserRole(
            id,
            updateUserRoleDto.roles,
        );
    }
}
