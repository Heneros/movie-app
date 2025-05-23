import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';


import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';

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

        const start = Date.now();
        if (cached) {
            const end = Date.now();
            console.log(`1234567123`);

            console.log(`Cache HIT for page ${page}, took ${end - start}ms`);
            return cached;
        }

        const allUsers = await this.usersRepository.findAllUsers(page);

        // console.log(allUsers);

        if (allUsers.length === 0) {
            throw new NotFoundException('No users exist');
        }

        const end = Date.now();
        console.log(`Cache MISS for page 444 ${page}, took ${end - start}ms`);

        await this.cacheManager.set(cacheKey, allUsers, CACHE_TTL.HALF_HOUR);

        return allUsers;
    }
}
