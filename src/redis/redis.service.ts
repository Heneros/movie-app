import { RedisClientType } from 'redis';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: RedisClientType;

    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async onModuleInit() {
        try {
            await this.cache.set('test-key', 'hello redis', 1000);
            const value = await this.cache.get('test-key');
            console.log('[Redis Test]', value);
        } catch (err) {
            console.error(`${err} Redis`);
        }
    }
    async onModuleDestroy() {
        if (this.client) await this.client.disconnect();
    }
}
