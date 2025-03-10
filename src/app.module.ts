import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import * as path from 'path';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSub } from 'graphql-subscriptions';

import { WinstonModule } from 'nest-winston';

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

        WinstonModule.forRoot({}),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: true,
            subscriptions: {
                'graphql-ws': true,
            },
        }),

        ThrottlerModule.forRoot([
            {
                name: 'long',
                ttl: 6000,
                limit: 100,
            },
        ]),
    ],
    controllers: [],
    providers: [
        // AppService,
        //  MovieResolver,
        // MailService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        // {
        //     provide: 'PUB_SUB',
        //     useValue: new PubSub(),
        // },
        // {
        //   provide: APP_GUARD,
        //   useClass: ThrottlerGuard,
        // },
        // {
        //   provide: APP_PIPE,
        //   useClass: EmailValidationPipe,
        // },
    ],
})
export class AppModule {}
