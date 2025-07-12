import { IQueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries';
import { Cache } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
export declare class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
    private readonly usersRepository;
    private cacheManager;
    constructor(usersRepository: UsersRepository, cacheManager: Cache);
    execute(query: FindAllUsersQuery): Promise<{
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
    }[]>;
}
