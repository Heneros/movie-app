import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { MovieFavorite } from './services/addMovieFavoriteList.service';

import { PrismaService } from '@/prisma/prisma.service';
import { AuthGuard } from '@/guards/auth.guard';
import {
  Inject,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { ProfileOwnerGuard } from '@/guards/ProfileOwner.guard';
import { MovieFindOneService } from './services/findOneMovie.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { Movie } from '@prisma/client';
import { MovieFindAllService } from './services/findAllMovie.service';
import { SearchMovieDto } from './dto/search-movie.dto';
import { MovieSearchService } from './services/searchMovie.service';
import { CheckMovieExistPipe } from './guard/checkIfMovieExist.guard';
import { MovieFindDraftsService } from './services/findDraftsMovie.service';
import { User } from '@/decorators/user.decorator';
import { MovieRateService } from './services/rateMovie.service';
import { MovieBasicInput } from './input/movie.input';
import { PubSubEngine } from 'graphql-subscriptions';

@Resolver((of) => MovieEntity)
export class MovieResolver {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieFindOneService: MovieFindOneService,
    private readonly movieFindAllService: MovieFindAllService,
    private readonly movieSearchService: MovieSearchService,
    private readonly movieFindDraftsService: MovieFindDraftsService,

    private movieRateService: MovieRateService,
    private movieFavorite: MovieFavorite,
    private prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @Mutation((returns) => MovieEntity, {
    description: 'Add to favorite list',
  })
  async addToFavorite(
    @Args('movieId', CheckMovieExistPipe) movieId: number,
    @Args('userId') userId: number,
  ) {
    const movie = await this.movieFindOneService.findOne(+movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    await this.movieFavorite.addMovieFav(movieId, userId);

    return new MovieEntity(movie);
    // console.log(movie);
  }

  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @Query((returns) => [MovieEntity], { description: 'Get All favorites ' })
  async getAllFavorites(@Args('id', { type: () => Int }) userId: number) {
    const favoriteMovies = await this.movieFavorite.getAllFavorites(userId);

    const movieIds = favoriteMovies.map((fav) => fav.movieId);

    return this.prisma.movie
      .findMany({
        where: { id: { in: movieIds } },
        include: { author: true },
      })
      .then((movies) => movies.map((movie) => new MovieEntity(movie)));
  }

  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @Mutation((returns) => MovieEntity, {
    description: 'Remove from favorites',
  })
  async removeFromFavorite(
    @Args('input') movieBasicInput: MovieBasicInput,
  ): Promise<MovieEntity> {
    const { movieId, userId } = movieBasicInput;
    if (!movieId || !userId) {
      throw new NotFoundException(
        `Problem: movieId (${movieId}) or userId (${userId}) is missing.`,
      );
    }
    // console.log(12231312);

    const movie = await this.movieFindOneService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    await this.movieFavorite.removeMovieFav(movieId, userId);
    return new MovieEntity(movie);
  }

  @Query(() => [MovieEntity], { description: 'Get All movies' })
  async getAllMovies(
    @Args('page', { type: () => Number, defaultValue: 1, nullable: false })
    page: number,
  ): Promise<MovieEntity[]> {
    const currentPage = page ?? 1;
    const skip = (currentPage - 1) * PAGINATION_LIMIT;

    const movies = (await this.movieFindAllService.findAll(skip)) as Movie[];

    return movies.map((movie) => new MovieEntity(movie));
  }

  @Query(() => [MovieEntity], { description: 'Search movies' })
  async searchMovies(
    @Args('title', { type: () => String }) title: string,
    @Args('pageString', { type: () => String }) pageString?: string,
  ) {
    const page = pageString ? parseInt(pageString, 10) : 1;
    const skip = (page - 1) * PAGINATION_LIMIT;
    const movies = await this.movieSearchService.searchByTitle(title, skip);

    if (!movies || movies.length === 0) {
      throw new NotFoundException(`Movies with title '${title}' do not exist.`);
    }

    return movies.map((movie) => new MovieEntity(movie));
  }

  @Query(() => [MovieEntity], { description: 'Get Drafts movies' })
  async findDrafts(
    @Args('pageString', { type: () => String }) pageString?: string,
  ) {
    const page = pageString ? parseInt(pageString, 10) : 1;
    const skip = (page - 1) * PAGINATION_LIMIT;
    const drafts = await this.movieFindDraftsService.findDrafts(skip);

    return drafts.map((draft) => new MovieEntity(draft));
  }

  @Query(() => MovieEntity, { description: 'Find By id movie' })
  async findById(
    @Args('id', { type: () => Number, nullable: false }, CheckMovieExistPipe)
    id: number,
  ) {
    return await this.movieFindOneService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MovieEntity, { description: 'Rate movie' })
  async rateMovie(
    @Args('id', { nullable: false }, CheckMovieExistPipe)
    movieId: number,
    @Args('rating', { nullable: false })
    value: number,
    @User('id')
    user: User,
  ) {
    const movie = await this.movieRateService.rateMovie(
      movieId,
      user.id,
      value,
    );

    return movie;
  }
}
