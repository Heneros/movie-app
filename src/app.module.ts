import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { seconds, ThrottlerModule } from '@nestjs/throttler';

import { join } from 'node:path';
import RedisStore, * as connectRedis from 'connect-redis';
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
// import { RedisConfig, RedisOptions } from './redis/redis-config';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
// import Redis from 'ioredis';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './Logger';
import { Logger } from 'winston';
// import { RedisModule } from './redis/redis.module';
// import session from 'express-session';
// import { SessionMiddleware } from './middleware/session.middleware';
import Redis from 'ioredis';
// import { Redis } from '@upstash/redis';
import { isProduction } from './data/defaultData';
// import { createRedisClient } from './redis/createClient';

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
            envFilePath: isProduction ? './.env.prod' : './.env',
            // load: [RedisConfig],
        }),
        //   RedisModule,
        // WinstonModule.forRoot(createWinstonOptions('Movie')),
        WinstonModule.forRoot(winstonLoggerOptions),
        Logger,
        // ThrottlerModule.forRootAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: async (configService: ConfigService) => {
        //         const isProd = process.env.NODE_ENV === 'production';

        //         if (isProd) {
        //             const url = configService.get<string>('REDIS_URL');
        //             const token = configService.get<string>('REDIS_TOKEN');
        //             if (!url || !token)
        //                 throw new Error('Missing Upstash config');

        //             return {
        //                 throttlers: [{ ttl: 60, limit: 700 }],
        //                 storage: new ThrottlerStorageRedisService(
        //                     `${url}?token=${token}`,
        //                 ),
        //             };
        //         } else {
        //             const redisClient = new Redis({
        //                 host: configService.get('REDIS_HOST'),
        //                 port: configService.get('REDIS_PORT'),
        //             });
        //             return {
        //                 throttlers: [{ ttl: 60, limit: 700 }],
        //                 storage: new ThrottlerStorageRedisService(redisClient),
        //             };
        //         }
        //     },
        // }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            autoSchemaFile:
                process.env.NODE_ENV === 'production'
                    ? true
                    : join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: process.env.NODE_ENV !== 'test',
            subscriptions:
                process.env.NODE_ENV === 'test'
                    ? false
                    : ({ 'graphql-ws': true } as any),
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
        // RedisService,
        Logger,
        //      SessionMiddleware,
        // {
        //     provide: APP_GUARD,
        //     useClass: GqlThrottlerGuard,
        // },
    ],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(SessionMiddleware).forRoutes('*');
    // }
}
