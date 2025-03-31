import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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

import { WinstonModule } from 'nest-winston';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisOptions } from './configs/redis-config';
import { RedisService } from './redis/event-store.service';

@Module({
    imports: [
        PrismaModule,
        MovieModule,
        UsersModule,
        AuthModule,
        MailModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CacheModule.registerAsync(RedisOptions),
        WinstonModule.forRoot({}),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 5,
                },
            ],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: true,
            context: ({ req }: { req: Request }) => ({ req }),
            subscriptions: {
                'graphql-ws': true,
            },
        }),

        CqrsModule.forRoot(),
    ],
    controllers: [],
    providers: [
        // AppService,
        //  MovieResolver,
        // MailService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: ClassSerializerInterceptor,
        // },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
