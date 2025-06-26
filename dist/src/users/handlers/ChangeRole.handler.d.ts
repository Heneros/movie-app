import { ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from './../repositories/users.repository';
import { ChangeRoleCommand } from '../commands';
export declare class ChangeRoleHandler implements ICommandHandler<ChangeRoleCommand> {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(command: ChangeRoleCommand): Promise<{
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
