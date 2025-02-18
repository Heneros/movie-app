import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { MovieFavorite } from './services/addMovieFavoriteList.service';

import { PrismaService } from '@/prisma/prisma.service';
import { AuthGuard } from '@/guards/auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ProfileOwnerGuard } from '@/users/guard/ProfileOwner.guard';
import { MovieFindOneService } from './services/findOneMovie.service';

@Resolver((of) => MovieEntity)
export class MovieResolver {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieFindOneService: MovieFindOneService,
    private movieFavorite: MovieFavorite,
    private prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard, ProfileOwnerGuard)
  @Mutation((returns) => MovieEntity, {
    description: 'Add to favorite list',
  })
  async addToFavorite(
    @Args('movieId') movieId: number,
    @Args('userId') userId: number,
  ) {
    const movie = await this.movieFindOneService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    return new MovieEntity(
      await this.movieFavorite.addMovieFav(movieId, userId),
    );
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
    @Args('movieId', { type: () => Int }) movieId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<MovieEntity> {
    const movie = await this.movieFindOneService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    await this.movieFavorite.removeMovieFav(movieId, userId);
    return new MovieEntity(movie);
  }
}
