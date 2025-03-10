import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MovieFavorite {
  constructor(private prisma: PrismaService) {}

  async addMovieFav(movieId: number, userId: number) {
    const movieFound = await this.prisma.userFavoriteMovies.findUnique({
      where: {
        userId_movieId: {
          movieId: movieId,
          userId: userId,
        },
      },
    });

    if (movieFound) {
      throw new BadRequestException('Movie Exist in Favorites list');
    }
    const movieUni = await this.prisma.userFavoriteMovies.create({
      data: {
        movieId,
        userId: userId,
      },
    });
    // console.log(movieUni);
    return movieUni;
  }

  async removeMovieFav(movieId: number, userId: number) {
    console.log(movieId, userId);
    console.log(`Removing movie ${movieId} from favorites for user ${userId}`);

    const movieFound = await this.prisma.userFavoriteMovies.findUnique({
      where: {
        userId_movieId: {
          movieId: movieId,
          userId: userId,
        },
      },
    });
    if (!movieFound) {
      throw new BadRequestException('Movie Not Found list');
    }

    await this.prisma.userFavoriteMovies.delete({
      where: {
        userId_movieId: {
          movieId,
          userId,
        },
      },
    });
    return movieFound;
  }

  async getAllFavorites(userId: number, skip: number = 0) {
    return await this.prisma.userFavoriteMovies.findMany({
      skip,
      take: PAGINATION_LIMIT,
      where: {
        userId,
      },
    });
  }
}
