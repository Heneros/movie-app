import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MovieEntity } from './entities/movie.entity';
import { MovieFavorite } from './services/addMovieFavoriteList.service';

import { PrismaService } from '@/prisma/prisma.service';
import { AuthGuard } from '@/guards/auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MovieService } from './movie.service';

@Resolver((of) => MovieEntity)
export class MovieResolver {
  constructor(
    private readonly movieService: MovieService,
    private movieFavorite: MovieFavorite,
    private prisma: PrismaService,
  ) {}

  @Query((returns) => [MovieEntity], { description: 'Get All favorites ' })
  @UseGuards(AuthGuard)
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

  @Mutation((returns) => MovieEntity, {
    description: 'Remove from favorites',
  })
  @UseGuards(AuthGuard)
  async removeFromFavorite(
    @Args('movieId', { type: () => Int }) movieId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<MovieEntity> {
    const movie = await this.movieService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    await this.movieFavorite.removeMovieFav(movieId, userId);

    return new MovieEntity(movie);
  }
}
