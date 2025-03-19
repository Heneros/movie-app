import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MovieFavorite } from './services/addMovieFavoriteList.service';
import { MovieResolver } from './movie.resolver';
import { MovieSearchService } from './services/searchMovie.service';
import { MovieCreateService } from './services/createMovie.service';
import { MovieFindAllService } from './services/findAllMovie.service';
import { MovieFindOneService } from './services/findOneMovie.service';
import { MovieUpdateService } from './services/updateMovie.service';
import { MovieRemoveService } from './services/removeMovie.service';
import { MovieFindDraftsService } from './services/findDraftsMovie.service';
import { MovieRateService } from './services/rateMovie.service';
import { MovieCreateReviewService } from './services/reviews/createReview.service';
import { MovieGetReviewsByMovieService } from './services/reviews/getReviewsByMovie.service';
import { MovieGetAllReviewService } from './services/reviews/getAllReviews.service';
import { MovieUpdateReviewService } from './services/reviews/updatereview.service';
import { MovieRemoveReviewService } from './services/reviews/removeByIdReview.service';
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

@Module({
    controllers: [MovieController],
    providers: [
        MovieService,
        MovieFavorite,
        MovieSearchService,
        MovieCreateService,
        MovieFindAllService,
        MovieFindOneService,
        MovieUpdateService,
        MovieRemoveService,
        MovieFindDraftsService,
        MovieRateService,
        MovieCreateReviewService,
        MovieGetReviewsByMovieService,
        MovieGetAllReviewService,
        MovieUpdateReviewService,
        MovieRemoveReviewService,

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

        // {
        //   provide: 'PUB_SUB',
        //   useValue: new PubSub(),
        // },
    ],
    imports: [
        PrismaModule,
        CqrsModule,
        CacheModule.register(),
        ThrottlerModule.forRoot([
            {
                // name: 'long',
                ttl: 6000,
                limit: 10,
            },
        ]),
    ],
})
export class MovieModule {}
