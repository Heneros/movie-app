import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';

import session from 'express-session';
import passport from 'passport';
import {
    BadRequestException,
    ClassSerializerInterceptor,
    ConsoleLogger,
    ValidationPipe,
} from '@nestjs/common';

import RedisStore from 'connect-redis';
//import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { domain } from './data/defaultData';
import { winstonLoggerOptions } from './Logger';
import { WinstonModule } from 'nest-winston';

import { createClient } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(winstonLoggerOptions),
        bufferLogs: true,
    });

    const redisClient = createClient({
        url: 'redis://localhost:6379',
        socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
    });

    redisClient.on('error', (err) =>
        console.error('Redis connection error:', err),
    );

    redisClient.on('connect', () =>
        console.log('Redis connected successfully'),
    );

    const redisStore = new this.redisStore({
        client: redisClient,
        prefix: 'sess:',
        ttl: 31 * 24 * 60 * 60,
    });
    // const httpServer = createServer(app.getHttpAdapter().getInstance());
    app.enableShutdownHooks();
    app.enableCors({
        origin: domain,
        credentials: true,
    });
    app.use(cookieParser());

    app.use(
        session({
            store: redisStore,
            // store: new (redisStore(session))({
            //     client: this.redis,
            //     logErrors: true,
            // }),
            secret: process.env.SECRET_SESSION,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 31 * 1000 * 60 * 60 * 24,
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },

            exceptionFactory: (errors) => {
                return new BadRequestException(
                    errors.map((err) => ({
                        field: err.property,
                        errors: Object.values(err.constraints),
                    })),
                );
            },
        }),
    );
    // console.log('App sTART 2');
    // app.useGlobalInterceptors(
    //     new ClassSerializerInterceptor(app.get(Reflector)),
    // );

    const config = new DocumentBuilder()
        .setTitle('Movie')
        .setDescription('The Movie REST API description')
        .setVersion('0.1')
        .addTag(
            'Auth',
            'Registration for became a user. Login, Reset password, verify email',
        )
        .addTag(
            'Users',
            'Only available for authorized user or admin role. Actions: remove user, deactivate user, delete my account, change profile data, get all users',
        )
        .addTag(
            'Movie',
            'Only available for authorized user, editor and admin role. Actions for movie. Rate and review movie, CRUD operations with movie',
        )
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'cookie',
            },
            'access-token',
        )
        .addSecurity('cookie-auth', {
            type: 'apiKey',
            in: 'header',
            name: 'Cookie',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);

    // app.get(RedisService);

    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            security: [
                {
                    'access-token': [],
                    'cookie-auth': [],
                },
            ],
        },
    });
    // console.log('App created 3 ');
    // app.useWebSocketAdapter(new WsAdapter(app, config, redis, jwt));
    // const { httpAdapter } = app.get(HttpAdapterHost);
    // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.listen(3000);
}
bootstrap();
