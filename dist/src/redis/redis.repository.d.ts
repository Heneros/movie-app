import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { Redis } from '@upstash/redis';
export declare class RedisRepository {
    private readonly redis;
    constructor(redis: Redis);
    private generateKey;
    get(prefix: RedisPrefixEnum, key: string): Promise<string | null>;
    set(prefix: string, key: string, value: string): Promise<void>;
    delete(prefix: string, key: string): Promise<void>;
    flushAll(): Promise<void>;
    setWithExpiry(prefix: RedisPrefixEnum, key: string, value: string, ttl: number): Promise<void>;
}
