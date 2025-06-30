// src/middleware/session.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    private sessionMiddleware: any;

    constructor(private configService: ConfigService) {
        const redisClient = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
        });

        const redisStore = new RedisStore({
            client: redisClient,
            prefix: 'sess:',
        });

        this.sessionMiddleware = session({
            store: redisStore,
            secret: this.configService.get('SECRET_SESSION') || 'testKey',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
        });

        //  console.log('Redis session middleware initialized');
    }

    use(req: Request, res: Response, next: NextFunction) {
        this.sessionMiddleware(req, res, next);
    }
}
