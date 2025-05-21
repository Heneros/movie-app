import { RedisClientType } from 'redis';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: RedisClientType;

    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async onModuleInit() {
        try {
            await this.cache.set('test-key', 'hello redis', 60000);
            const value = await this.cache.get('test-key');
            console.log('[Redis Test]', value);
        } catch (err) {
            console.error(`${err} Redis`);
        }
    }
    async onModuleDestroy() {
        console.log('[Redis Test] connection closed');
        if (this.client) await this.client.quit();
    }
}
