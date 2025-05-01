import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MovieFavorite } from './services/addMovieFavoriteList.service';
import { MovieResolver } from './movie.resolver';
import { ThrottlerModule } from '@nestjs/throttler';
import { AddMovieFavoriteHandler } from './handlers/favorite/addMovieFavorite.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisService } from '@/redis/redis.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
// import {
//     CreateMovieHandler,
//     CreateMovieReviewHandler,
//     FindAllMovieHandler,
//     FindDraftsHandler,
//     GetAllFavoritesHandler,
//     GetAllReviewsByMovieHandler,
//     GetAllReviewsHandler,
//     RateMovieHandler,
//     RemoveMovieFavHandler,
//     RemoveMovieHandler,
//     RemoveMReviewHandler,
//     SearchMovieHandler,
//     UpdateMovieHandler,
//     UpdateReviewHandler,
// } from './handlers';
import * as Handlers from './handlers';
import { MovieRepository } from './repositories/movie.repository';
import { ReviewRepository } from './repositories/review.repository';
import { RedisModule } from '@/redis/redis.module';

@Module({
    controllers: [MovieController],
    providers: [
        ...Object.values(Handlers),
        MovieRepository,
        ReviewRepository,
        MovieResolver,
        RedisService,

    ],
    imports: [
        PrismaModule,
        CqrsModule,
        CloudinaryModule,
        RedisModule,

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
