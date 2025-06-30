import { createClient, RedisClientType } from 'redis';
import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisRepository } from './redis.repository';
import { Movie } from '@prisma/client';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType;

    //  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
    constructor(
        private readonly configService: ConfigService,

        @Inject(RedisRepository)
        private readonly redisRepository: RedisRepository,
    ) {
        this.client = createClient({
            socket: {
                host: this.configService.get<string>('REDIS_HOST'),
                port: this.configService.get<number>('REDIS_PORT'),
            },
            //// password:   this.configService.get<string>('REDIS_PASSWORD') || undefined,
        });

        // this.client.on('error', (err) => {
        //     console.error('Redis Client Error:', err);
        // });

        // this.client.on('connect', () => {
        //     console.log('Connected to Redis');
        // });
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
