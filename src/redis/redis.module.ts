import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import Redis from 'ioredis';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [
        RedisService,
        RedisRepository,
        {
            provide: 'RedisClient',
            useFactory: (config: ConfigService) => {
                const host = config.get<string>('REDIS_HOST', 'redis');
                const port = config.get<number>('REDIS_PORT', 6379);
                return new Redis({ host, port });
            },
            inject: [ConfigService],
        },
    ],
    exports: ['RedisClient', RedisService, RedisRepository],
})
export class RedisModule {}
