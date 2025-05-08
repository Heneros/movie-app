import { MiddlewareConsumer, Module } from '@nestjs/common';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

import { join } from 'node:path';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisConfig, RedisOptions } from './redis/redis-config';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { RedisService } from './redis/redis.service';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './Logger';
import { Logger } from 'winston';

@Module({
    imports: [
        PrismaModule,
        MovieModule,
        UsersModule,
        AuthModule,
        MailModule,
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            envFilePath: './.env',
            load: [RedisConfig],
        }),
        // WinstonModule.forRoot(createWinstonOptions('Movie')),
        CacheModule.registerAsync(RedisOptions),
        WinstonModule.forRoot(winstonLoggerOptions),
        Logger,
        // RedisModule,
        // CacheModule.registerAsync(RedisOptions),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const redisClient = new Redis({
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    // password: configService.get('REDIS_PASSWORD'),
                });
                return {
                    throttlers: [{ ttl: 60, limit: 10000 }],
                    storage: new ThrottlerStorageRedisService(redisClient),
                    // getTracker: (req, context) => req.headers['x-device-id'],
                };
            },
        }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: true,
            subscriptions: {
                'graphql-ws': true,
            },
            context: ({ req, res }: { req: Request; res: Response }) => ({
                req,
                res,
            }),
        }),
        CqrsModule.forRoot(),
        CloudinaryModule,
    ],
    controllers: [],
    providers: [
        RedisService,
        Logger,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: GqlThrottlerGuard,
        },
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
        // consumer.apply()
    }
}