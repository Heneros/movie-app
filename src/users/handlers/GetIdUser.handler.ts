import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIdUserQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { User } from '@prisma/client';

const CACHE_KEY_PREFIX = 'users:page';

@QueryHandler(GetIdUserQuery)
export class GetIdUserHandler implements IQueryHandler<GetIdUserQuery> {
    constructor(
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: GetIdUserQuery) {
        const { id } = query;

        const user = await this.usersRepository.findIdUser(id);
        if (!user) {
            throw new NotFoundException('No user found');
        }
        return user;
    }
}
