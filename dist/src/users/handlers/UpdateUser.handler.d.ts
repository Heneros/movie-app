import { ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from './../repositories/users.repository';
import { UpdateUserCommand } from '../commands';
import { GetIdUserHandler } from './GetIdUser.handler';
export declare class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    private readonly getIdUserHandler;
    private readonly usersRepository;
    constructor(getIdUserHandler: GetIdUserHandler, usersRepository: UsersRepository);
    execute(command: UpdateUserCommand): Promise<{
        name: string;
        email: string;
        password: string;
        id: number;
        createdAt: Date;
        roles: string[];
        updatedAt: Date;
        isEmailVerified: boolean;
        refreshToken: string[];
        blocked: boolean;
        provider: string | null;
        googleId: string | null;
        githubId: string | null;
        discordId: string | null;
    }>;
}
