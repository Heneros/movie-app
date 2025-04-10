import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBlockedUsersQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(GetAllBlockedUsersQuery)
export class GetAllBlockedUsersHandler
    implements IQueryHandler<GetAllBlockedUsersQuery>
{
    constructor(
        // private readonly prisma: PrismaService,
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: GetAllBlockedUsersQuery) {
        const { page } = query;
        const cacheKey = `users-blocked:${page}`;
        const cached = await this.cacheManager.get<User[]>(cacheKey);
        if (cached) {
            // console.log('✅ Cache HIT');
            return cached;
        }

        const allUsers = await this.usersRepository.findAllBlockedUsers(page);

        if (allUsers.length === 0) {
            throw new NotFoundException('No users exist');
        }

        await this.cacheManager.set(cacheKey, allUsers, CACHE_TTL.HALF_HOUR);

        return allUsers;
    }
}
