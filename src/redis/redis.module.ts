import { Module } from '@nestjs/common';
// import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';
//  import { CacheModule } from '@nestjs/cache-manager';

//  import { RedisOptions } from './redis-config';
//  import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { CacheConfigFactory } from './redis.factory';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
