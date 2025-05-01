import { Module } from '@nestjs/common';
// import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisOptions } from './redis-config';
// import { CacheConfigFactory } from './redis.factory';

@Module({
    imports: [CacheModule.registerAsync(RedisOptions)],

    exports: [RedisService],
    providers: [RedisService],
    // providers: [RedisClient, RedisService],
})
export class RedisModule {}
