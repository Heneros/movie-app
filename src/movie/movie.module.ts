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
import {
    CreateMovieHandler,
    CreateMovieReviewHandler,
    FindAllMovieHandler,
    FindDraftsHandler,
    GetAllFavoritesHandler,
    GetAllReviewsByMovieHandler,
    GetAllReviewsHandler,
    RateMovieHandler,
    RemoveMovieFavHandler,
    RemoveMovieHandler,
    RemoveMReviewHandler,
    SearchMovieHandler,
    UpdateMovieHandler,
    UpdateReviewHandler,
} from './handlers';
import { GetSingleReviewHandler } from './handlers/reviews/getSingleReview.handler';
import { FindOneHandler } from './handlers/findOneMovie.handler';
import { MovieRepository } from './repositories/movie.repository';
import { ReviewRepository } from './repositories/review.repository';

@Module({
    controllers: [MovieController],
    providers: [
        MovieService,
        MovieFavorite,

        MovieResolver,

        MovieRepository,
        ReviewRepository,
        AddMovieFavoriteHandler,
        RemoveMovieFavHandler,
        GetAllFavoritesHandler,
        UpdateMovieHandler,
        SearchMovieHandler,
        RateMovieHandler,
        CreateMovieHandler,
        RemoveMovieHandler,
        FindAllMovieHandler,
        FindOneHandler,
        CreateMovieReviewHandler,
        GetAllReviewsHandler,
        GetAllReviewsByMovieHandler,
        GetSingleReviewHandler,
        UpdateReviewHandler,
        FindDraftsHandler,

        RedisService,
        RemoveMReviewHandler,
    ],
    imports: [
        PrismaModule,
        CqrsModule,
        CloudinaryModule,

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
