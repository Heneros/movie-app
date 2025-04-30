import { Module } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

// import { CacheConfigFactory } from './redis.factory';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: configService.get('CACHE_TTL'),
            }),
            // useClass: CacheConfigFactory,
        }),
    ],
    exports: [RedisService],
    providers: [RedisClient, RedisService],
})
export class RedisModule {}
