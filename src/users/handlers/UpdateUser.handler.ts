import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { Inject, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { UpdateUserCommand } from '../commands';
import { roundsOfHashing } from '@/data/defaultData';
import { GetIdUserHandler } from './GetIdUser.handler';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        private readonly getIdUserHandler: GetIdUserHandler,
        private readonly usersRepository: UsersRepository,
    ) {}

    async execute(command: UpdateUserCommand) {
        const { id, updateUserDto } = command;

        const user = await this.usersRepository.findIdUser(id);
        if (!user) {
            throw new NotFoundException('No user found');
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                roundsOfHashing,
            );
        }
        const updatedUser = await this.usersRepository.updateUser(
            id,
            updateUserDto,
        );

        await this.getIdUserHandler.invalidateUserCache(id);
        return updatedUser;
        // return user;
    }
    
}
