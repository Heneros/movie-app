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

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    // private client: RedisClientType;

    constructor(
        private readonly configService: ConfigService,

        @Inject(RedisRepository)
        private readonly redisRepository: RedisRepository,
        @Inject('RedisClient') private readonly client: RedisClientType,
    ) {
        const socket = {
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
        };

        this.client = createClient({
            // url,
            socket,
        });
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

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }

    getClient(): RedisClientType {
        return this.client;
    }

    async saveMovies(page: string, data: any): Promise<void> {
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.MOVIE_LIST,
            page,
            JSON.stringify(data),
            CACHE_TTL.ONE_HOUR,
        );
    }

    async deleteMovies(moviePage: string) {
        await this.redisRepository.delete(
            RedisPrefixEnum.MOVIE_LIST,
            moviePage,
        );
    }

    async getMovies(moviePage: string) {
        const movie = await this.redisRepository.get(
            RedisPrefixEnum.MOVIE_LIST,
            moviePage,
        );

        try {
            return JSON.parse(movie);
        } catch {
            return null;
        }
    }
}
