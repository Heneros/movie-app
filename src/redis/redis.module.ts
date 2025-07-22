import { Module } from '@nestjs/common';
 import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { RedisProvider } from './redis.provider';
import { RedisRepository } from './redis.repository';

@Module({

    providers: [
        RedisRepository,
        RedisService,
         RedisProvider
    ],
    exports: ['REDIS_CLIENT', RedisRepository, RedisService],
})
export class RedisModule {}
