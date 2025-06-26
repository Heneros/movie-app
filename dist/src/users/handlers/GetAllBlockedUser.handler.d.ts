import { IQueryHandler } from '@nestjs/cqrs';
import { GetAllBlockedUsersQuery } from '../queries';
import { LoggerService } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';
export declare class GetAllBlockedUsersHandler implements IQueryHandler<GetAllBlockedUsersQuery> {
    private readonly logger;
    private readonly usersRepository;
    private cacheManager;
    constructor(logger: LoggerService, usersRepository: UsersRepository, cacheManager: Cache);
    execute(query: GetAllBlockedUsersQuery): Promise<User[]>;
}
