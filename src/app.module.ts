import {
    ClassSerializerInterceptor,
    MiddlewareConsumer,
    Module,
} from '@nestjs/common';
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
import { RedisOptions } from './configs/redis-config';
import { GqlThrottlerGuard } from './guards/gql-throttler.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RedisModule } from '@nestjs-modules/ioredis';

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
        }),
        CacheModule.registerAsync(RedisOptions),
        WinstonModule.forRoot({}),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [
                {
                    ttl: config.get('THROTTLE_TTL'),
                    limit: config.get('THROTTLE_LIMIT'),
                },
            ],
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
        RedisModule,
        CloudinaryModule,
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
            useClass: GqlThrottlerGuard,
        },
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
        // consumer.apply()
    }
}
