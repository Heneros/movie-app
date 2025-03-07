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
import { PubSub } from 'graphql-subscriptions';
import { MovieCreateReviewService } from './services/reviews/createReview.service';
import { MovieGetReviewsByMovieService } from './services/reviews/getReviewsByMovie.service';
import { MovieGetAllReviewService } from './services/reviews/getAllReviews.service';

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
        MovieResolver,
    ],
    imports: [PrismaModule, CacheModule.register()],
})
export class MovieModule {}
