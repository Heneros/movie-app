import { isDevelopment } from '@/data/defaultData';
import  { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || '',

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
                username: config.username,
                password: config.password,
                socket: {
                    host: config.host,
                    port: config.port,        
                },
            }),
            ttl: config.ttl,
        };
    },
};
