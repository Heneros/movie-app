import { ClassSerializerInterceptor, Module } from '@nestjs/common';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { RedisService } from '@nestjs/redis';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';
import * as path from 'path';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { MovieModule } from './movie/movie.module';
// import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSub } from 'graphql-subscriptions';
import { MovieModule } from './users/movie.module';
// import { WinstonModule } from 'nest-winston';

@Module({
    imports: [
        // PrismaModule,

        MovieModule,
        // UsersModule,
        // AuthModule,
        // MailModule,
        // ConfigModule.forRoot({
        //     isGlobal: true,
        // }),

        // WinstonModule.forRoot({}),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: true,
            subscriptions: {
                'graphql-ws': {
                    onConnect: (ctx) => {
                        console.log('✅ WebSocket connected:');
                    },
                    onDisconnect: () => {
                        console.log('❌ WebSocket disconnected');
                    },
                },
            },
        }),
        // GraphQLModule.forRootAsync<ApolloDriverConfig>({
        //     imports: [MovieModule, ConfigModule, AppModule, AuthModule],
        //     inject: [ConfigService],
        //     driver: ApolloDriver,
        //     useFactory: async () => {
        //         return {
        //             debug: true,
        //             installSubscriptionHandlers: true,
        //             playground: true,
        //             sortSchema: true,
        //             autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        //             subscriptions: {
        //                 'graphql-ws': {
        //                     onConnect: (ctx) => {
        //                         console.log('Connected to WebSocket:');
        //                     },
        //                     onDisconnect: () => {
        //                         console.log(' WebSocket disconnected');
        //                     },
        //                 },
        //                 //  'subscriptions-transport-ws': true,
        //                 // 'graphql-ws': {

        //                 // },
        //                 //                 'graphql-ws': true,
        //                 //                     onConnect: (ctx) => {
        //                 //     console.log("Connected to WebSocket:", ctx);
        //                 // },
        //                 // 'graphql-ws': {
        //                 //     path: '/graphql',
        //                 // },
        //             },

        //             context: ({ req, res }) => ({ req, res }),
        //             // context: ({ req, res, connection }) => {
        //             //     if (connection) {
        //             //         return { req, res, user: connection.context.user };
        //             //     }
        //             //     return { req, res };
        //             // },
        //             // introspection: true,
        //         };
        //     },
        // }),
        // CacheModule.register({
        //     store: redisStore,
        //     socket: {
        //         host: 'localhost',
        //         port: 6379,
        //     },
        // }),

        // ThrottlerModule.forRoot([
        //   {
        //     name: 'long',
        //     ttl: 6000,
        //     limit: 100,
        //   },
        // ]),
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
