import 'module-alias/register';

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';

import session from 'express-session';
import passport from 'passport';

import MemoryStore from 'memorystore';

import {
    BadRequestException,
    ClassSerializerInterceptor,
    ConsoleLogger,
    ValidationPipe,
} from '@nestjs/common';

import RedisStore from 'connect-redis';
//import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { domain, domainClient } from './data/defaultData';
import { winstonLoggerOptions } from './Logger';
import { WinstonModule } from 'nest-winston';

import createMemoryStore from 'memorystore';

let app;
async function bootstrap() {
    if (!app) {
        app = await NestFactory.create(AppModule, {
            logger: WinstonModule.createLogger(winstonLoggerOptions),
            bufferLogs: true,
        });

        // const configService = app.get(ConfigService);

        // const redisClient = new Redis({
        //     host: configService.get('REDIS_HOST'),
        //     port: configService.get('REDIS_PORT'),
        // });

        // const redisStore = new RedisStore({
        //     client: redisClient,
        //     prefix: 'sess:',
        // });

        // const httpServer = createServer(app.getHttpAdapter().getInstance());
        app.enableShutdownHooks();
        app.enableCors({
            origin: [domain, domainClient],
            credentials: true,
        });
        app.use(cookieParser());

        const MemoryStore = createMemoryStore(session);

        app.use(
            session({
                store: new MemoryStore({
                    checkPeriod: 86400000,
                }),
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

        // await app.listen(3000);

        await app.init();
    }
    return app;
}
export default async function handler(req, res) {
    const app = await bootstrap();
    return app.getHttpAdapter().getInstance()(req, res);
}

if (process.env.NODE_ENV !== 'production') {
    bootstrap().then((app) => {
        app.listen(3000, () => {
            console.log('Application is running on port 3000');
        });
    });
}
// bootstrap();
