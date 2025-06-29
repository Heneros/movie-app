import { Module } from '@nestjs/common';
// import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';
//  import { CacheModule } from '@nestjs/cache-manager';

//  import { RedisOptions } from './redis-config';
//  import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import Redis from 'ioredis';
// import { CacheConfigFactory } from './redis.factory';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [
        RedisService,
        {
            provide: 'RedisClient',
            useFactory: (config: ConfigService) => {
                return new Redis({
                    host: config.get<string>('REDIS_HOST'),
                    port: config.get<number>('REDIS_PORT'),
                    password: config.get<string>('REDIS_PASSWORD') || undefined,
                });
            },
            inject: [ConfigService],
        },
        RedisRepository,
    ],
    exports: [RedisService, RedisRepository],
})
export class RedisModule {}
