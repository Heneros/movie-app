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

import { RemoveMovieFavHandler } from './handlers/favorite/removeMovieFavorite.handler';
import { GetAllFavoritesHandler } from './handlers/favorite/getAllFavorite.handler';
import { UpdateMovieHandler } from './handlers/updateMovie.handler';
import { SearchMovieHandler } from './handlers/searchMovie.handler';

import { CreateMovieHandler } from './handlers/createMovie.handler';
import { RemoveMovieHandler } from './handlers/removeMovie.handler';
import { RateMovieHandler } from './handlers/rateMovie.handler';
import { FindAllMovieHandler } from './handlers/findAllMovie.handler';
import { MovieRepository } from './repositories/movie.repository';
import { FindOneHandler } from './handlers/findOneMovie.handler';
import { CreateMovieReviewHandler } from './handlers/reviews/createReview.handler';
import { GetAllReviewsHandler } from './handlers/reviews/getAllReviews.handler';
import { GetAllReviewsByMovieHandler } from './handlers/reviews/getAllReviewsByMovie.handler';
import { GetSingleReviewHandler } from './handlers/reviews/getSingleReview.handler';
import { ReviewRepository } from './repositories/review.repository';
import { UpdateReviewHandler } from './handlers/reviews/updateReview.handler';
import { FindDraftsHandler } from './handlers/findDrafts.handler';
import { CreatedMovieReviewHandler } from './handlers/reviews/createdReview.handler';
import { RedisService } from '@/redis/event-store.service';
import { RemoveMReviewHandler } from './handlers/reviews/removeReview.handler';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

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
        CreatedMovieReviewHandler,
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
