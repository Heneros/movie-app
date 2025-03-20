import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const port = configService.get<number>('REDIS_PORT', 6379);
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const store = await redisStore({
            socket: {
                host,
                port,
            },
        });
        return {
            store: () => store,
        };
    },
    inject: [ConfigService],
};
