import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisRepository {
    constructor(@Inject('RedisClient') private readonly redis: Redis) {}

    private generateKey(prefix: RedisPrefixEnum, key: string): string {
        return `${prefix}:${key}`;
    }

    async get(prefix: RedisPrefixEnum, key: string): Promise<string | null> {
        const fullKey = this.generateKey(prefix, key);
        return await this.redis.get(fullKey);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redis.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.redis.del(`${prefix}:${key}`);
    }

    async flushAll(): Promise<void> {
        await this.redis.flushdb();
    }

    async setWithExpiry(
        prefix: RedisPrefixEnum,
        key: string,
        value: string,
        ttl: number,
    ) {
        const fullKey = this.generateKey(prefix, key);
        await this.redis.set(fullKey, value, { ex: ttl });
    }
}
