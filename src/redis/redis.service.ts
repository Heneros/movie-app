import { createClient, RedisClientType } from 'redis';
import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';

import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';
import { isTest } from '@/data/defaultData';
import { Redis } from '@upstash/redis';
import { createRedisClient } from './createClient';

@Injectable()
export class RedisService {
    // private client: RedisClientType;

    constructor(
        private readonly configService: ConfigService,

        @Inject(RedisRepository)
        private readonly redisRepository: RedisRepository,
        //@Inject('RedisClient') private readonly client: RedisClientType,
        @Inject('RedisClient') private readonly client: Redis,
    ) {
        const socket = {
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
        };

        //  this.client = createClient({
        // url,
        //   socket,
        // });
        // if (!isTest) {
        //     this.client = createClient({
        //         // url,
        //         socket,
        //         // username: this.configService.get<string>('REDIS_USERNAME'),
        //         // password: this.configService.get<string>('REDIS_PASSWORD'),
        //     });
        // } else {
        //     this.client = createClient({
        //         // url,
        //         socket,
        //     });
        // }
    }

    getRedis(): Redis {
        const redisUrl = this.configService.get<string>('REDIS_URL');

        const redisToken = this.configService.get<string>('REDIS_TOKEN');
        if (!redisUrl || !redisToken) {
            throw new Error('Missing Upstash Redis config');
        }
        return createRedisClient(redisUrl, redisToken);
    }

    private makeKey(prefix: RedisPrefixEnum, key: string): string {
        return `${prefix}:${key}`;
      }
    
    async saveMovies(page: string, data: any): Promise<void> {
        // await this.getRedis().set(
        //     RedisPrefixEnum.MOVIE_LIST,
        //     page,
        //     JSON.stringify(data),
        //     CACHE_TTL.ONE_HOUR,
        // );
        const redis = this.getRedis();
        const key = this.makeKey(RedisPrefixEnum.MOVIE_LIST, page);
        await redis.set(key, JSON.stringify(data), { ex: CACHE_TTL.ONE_HOUR });
    }

    async deleteMovies(moviePage: string) {
        await this.redisRepository.delete(
            RedisPrefixEnum.MOVIE_LIST,
            moviePage,
        );
    }

    async getMovies(moviePage) {
        const movie = await this.redisRepository.get(
            RedisPrefixEnum.MOVIE_LIST,
            moviePage,
        );
        return JSON.parse(movie);
        // try {
        //     return JSON.parse(movie);
        // } catch {
        //     return null;
        // }
    }
}
