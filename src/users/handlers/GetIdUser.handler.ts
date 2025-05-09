import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIdUserQuery } from '../queries';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from './../repositories/users.repository';
import { UserEntity } from '../entities-objectType/user.entity';
import { plainToInstance } from 'class-transformer';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(GetIdUserQuery)
export class GetIdUserHandler implements IQueryHandler<GetIdUserQuery> {
    constructor(
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async invalidateUserCache(userId: number): Promise<void> {
        const cacheKey = `users:${userId}`;
        await this.cacheManager.del(cacheKey);
    }

    async execute(query: GetIdUserQuery) {
        try {
            const { id } = query;
            const cacheKey = `users:${id}`;

            const cachedUser =
                await this.cacheManager.get<UserEntity>(cacheKey);

            const user = await this.usersRepository.findIdUser(id);
            if (!user) {
                throw new NotFoundException('No user found');
            }

            if (cachedUser) {
                // console.log(` [User Cache] HIT for user ID: ${id}`);
                return plainToInstance(UserEntity, cachedUser);
            }

            const userDto = plainToInstance(UserEntity, user);

            await this.cacheManager.set(
                cacheKey,
                userDto,
                CACHE_TTL.THREE_HOUR,
            );
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}
