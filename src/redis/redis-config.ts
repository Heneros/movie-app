import { isDevelopment } from '@/data/defaultData';
import type { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    // password: process.env.REDIS_PASSWORD || '',
    ttl: parseInt(process.env.REDIS_TTL || '60000', 10),
}));

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const config =
            configService.get<ReturnType<typeof RedisConfig>>('redis');

        return {
            store: await redisStore({
                socket: {
                    host: config.host,

                    // host: 'host.docker.internal',
                    port: config.port,
                },
                // password: config.password,
            }),
            ttl: config.ttl,
        };
    },
};
