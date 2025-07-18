import { Injectable, Inject } from '@nestjs/common';
import type { Redis as UpstashRedisClient } from '@upstash/redis';
import type { Redis as IORedisClient } from 'ioredis';

import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

type AnyRedisClient = UpstashRedisClient | IORedisClient;

@Injectable()
export class RedisService {
    constructor(
        @Inject('RedisClient')
        private readonly redis: AnyRedisClient,
    ) {}

    private makeKey(prefix: RedisPrefixEnum, page: string): string {
        return `${prefix}:${page}`;
    }

    async saveMovies(page: string, data: any): Promise<void> {
        const key = this.makeKey(RedisPrefixEnum.MOVIE_LIST, page);
        const value = JSON.stringify(data);
        await this.redis.set(key, value);
        await this.redis.expire(key, CACHE_TTL.ONE_HOUR);

        //   console.log(value);
        // const res = await this.redis.set(key, value, {
        //     ex: CACHE_TTL.ONE_HOUR,
        // });
        // console.log(res);
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
