import { OnModuleInit } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
export declare class RedisService implements OnModuleInit {
    private readonly cache;
    private client;
    constructor(cache: Cache);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
