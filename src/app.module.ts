import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { RedisService } from '@nestjs/redis';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    MovieModule,
    AuthModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),

      subscriptions: {
        // 'subscriptions-transport-ws': true,
        // 'graphql-ws': true,
        'graphql-ws': {
          path: '/graphql',
        },
      },

      context: ({ req, res }) => ({ req, res }),
      // installSubscriptionHandlers: true,
      include: [MovieModule, AuthModule],
      playground: true,
      introspection: true,
    }),
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // ThrottlerModule.forRoot([
    //   {
    //     name: 'long',
    //     ttl: 6000,
    //     limit: 100,
    //   },
    // ]),
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },

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
