import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { PrismaModule } from '@/prisma/prisma.module';

import { MovieResolver } from './movie.resolver';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

import * as Handlers from './handlers';
import { MovieRepository } from './repositories/movie.repository';
import { ReviewRepository } from './repositories/review.repository';
import { RedisModule } from '@/redis/redis.module';
import { Logger } from 'winston';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    controllers: [MovieController],
    providers: [
        ...Object.values(Handlers),
        MovieRepository,
        ReviewRepository,
        MovieResolver,
    ],
    imports: [
        PrismaModule,
        CqrsModule,
        CloudinaryModule,
        RedisModule,
        Logger,
        CacheModule.register(),
        // CacheModule.register({
        //     isGlobal: true,
        // }),

        // ThrottlerModule.forRoot([
        //     {
        //         // name: 'long',
        //         ttl: 6000,
        //         limit: 10,
        //     },
        // ]),
    ],
})
export class MovieModule {}
