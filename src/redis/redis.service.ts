// redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

@Injectable()
export class RedisService {
    constructor(
        @Inject('RedisClient')
        private readonly redis: Redis,
    ) {}

    private makeKey(prefix: RedisPrefixEnum, page: string): string {
        return `${prefix}:${page}`;
    }

    async saveMovies(page: string, data: any): Promise<void> {
        const key = this.makeKey(RedisPrefixEnum.MOVIE_LIST, page);
        const value = JSON.stringify(data);
        console.log(value);
        const res = await this.redis.set(key, value, {
            ex: CACHE_TTL.ONE_HOUR,
        });
        console.log(res);
    }

    async deleteMovies(page: string): Promise<void> {
        const key = this.makeKey(RedisPrefixEnum.MOVIE_LIST, page);
        await this.redis.del(key);
    }

    async getMovies(page: string): Promise<string | null> {
        const key = this.makeKey(RedisPrefixEnum.MOVIE_LIST, page);
        const result = await this.redis.get<string>(key);
        if (result) {
            return result;
        }

        return null;
    }
}
