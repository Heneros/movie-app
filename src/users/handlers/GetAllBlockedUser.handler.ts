import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBlockedUsersQuery } from '../queries';
import { Inject, LoggerService, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@QueryHandler(GetAllBlockedUsersQuery)
export class GetAllBlockedUsersHandler
    implements IQueryHandler<GetAllBlockedUsersQuery>
{
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: GetAllBlockedUsersQuery): Promise<User[]> {
        const { page } = query;
        const cacheKey = `${RedisPrefixEnum.USERS}:blocked:${page}`;

        const cached = await this.cacheManager.get<User[]>(cacheKey);
        if (cached) {
            return cached;
        }

        // console.log(123);
        const allUsers = await this.usersRepository.findAllBlockedUsers(page);

        if (allUsers.length === 0) {
            this.logger.warn(`No blocked users found on page ${page}`);
            throw new NotFoundException('No blocked users found');
        }
        await this.cacheManager.set(cacheKey, allUsers, CACHE_TTL.HALF_HOUR);

        return allUsers;
    }
}
