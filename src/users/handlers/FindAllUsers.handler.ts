import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';

const CACHE_KEY_PREFIX = 'users:page';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
    constructor(
        // private readonly prisma: PrismaService,
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: FindAllUsersQuery) {
        const { page } = query;
        const cacheKey = `${CACHE_KEY_PREFIX}:${page}`;
        const cached = await this.cacheManager.get<User[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const allUsers = await this.usersRepository.findAllUsers(page);

        if (allUsers.length === 0) {
            throw new NotFoundException('No users exist');
        }

        await this.cacheManager.set(cacheKey, allUsers, 60 * 5);
        return allUsers;
    }
}
