import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import RedisIO from 'ioredis';
import { createRedisClient } from './createClient';
import { Redis as UpstashRedis } from '@upstash/redis';

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
                const env = config.get<string>('NODE_ENV', 'development');

                if (env === 'production') {
                    const url = config.get<string>('REDIS_URL');
                    const token = config.get<string>('REDIS_TOKEN');
                    if (!url || !token) {
                        throw new Error('Missing Upstash Redis config');
                    }
                    return createRedisClient(url, token) as UpstashRedis;
                } else {
                    const host = config.get('REDIS_HOST', 'localhost');
                    const port = config.get('REDIS_PORT', 6379);

                    return new RedisIO({ host, port });
                }
            },
            inject: [ConfigService],
        },
    ],
    exports: ['RedisClient', RedisService, RedisRepository],
})
export class RedisModule {}
