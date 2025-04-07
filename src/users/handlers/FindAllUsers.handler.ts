import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';

// const CACHE_KEY_PREFIX = 'users';
export const deleteCache = async (cacheService: Cache, partialKey: string) => {
    const keys = await cacheService.stores;
    // console.log(keys);
    keys.forEach((eachKey) => {
        const keyString = String(eachKey);

        if (keyString.includes(partialKey)) {
            cacheService.del(keyString);
        }
    });
};

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
    constructor(
        // private readonly prisma: PrismaService,
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: FindAllUsersQuery) {
        const { page } = query;
        const cacheKey = `users:${page}`;
        const cached = await this.cacheManager.get<User[]>(cacheKey);
        if (cached) {
            // console.log('✅ Cache HIT');

            return cached;
        }
        // console.log('❌ Cache MISS');

        const allUsers = await this.usersRepository.findAllUsers(page);

        if (allUsers.length === 0) {
            throw new NotFoundException('No users exist');
        }

        await this.cacheManager.set(cacheKey, allUsers, CACHE_TTL.HALF_HOUR);

        return allUsers;
    }
}
