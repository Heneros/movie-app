import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService: ConfigService) => {
        const env = configService.get('NODE_ENV');

        console.log(env);
        if (env === 'production') {
            const redisUrl = configService.get<string>('REDIS_URL_ORIGINAL');

            if (!redisUrl) {
                throw new Error('REDIS_URL_ORIGINAL is not defined in .env');
            }

            return new Redis(redisUrl);
        }
        const host = configService.get<string>('REDIS_HOST', 'redis');
        const port = configService.get<number>('REDIS_PORT', 6379);
        return new Redis({ host, port });
    },
    inject: [ConfigService],
};
