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
import { PubSub, PubSubEngine } from 'graphql-subscriptions';

const pubSub = new PubSub();

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
    MovieResolver,
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],

  imports: [PrismaModule, CacheModule.register()],
  exports: ['PUB_SUB'],
})
export class MovieModule {}
