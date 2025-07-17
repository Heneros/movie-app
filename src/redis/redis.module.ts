import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import Redis from 'ioredis';
import { createRedisClient } from './createClient';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [
        RedisService,
        RedisRepository,
        // {
        //     provide: 'RedisClient',
        //     useFactory: (config: ConfigService) => {
        //         const host = config.get<string>('REDIS_HOST', 'redis');
        //         const port = config.get<number>('REDIS_PORT', 6379);
        //         return new Redis({ host, port });
        //     },
        //     inject: [ConfigService],
        // },
        {
            provide: 'RedisClient',
            useFactory: (config: ConfigService) => {
                const redisUrl = config.get<string>('REDIS_URL');
                const redisToken = config.get<string>('REDIS_TOKEN');
                if (!redisUrl || !redisToken) {
                    throw new Error('Missing Upstash Redis config');
                }
                // console.log(config.get('REDIS_URL'));
                return createRedisClient(redisUrl, redisToken);
            },
            inject: [ConfigService],
        },
    ],
    exports: ['RedisClient', RedisService, RedisRepository],
})
export class RedisModule {}
