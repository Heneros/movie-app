import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MovieFavorite {
  constructor(private prisma: PrismaService) {}

  async addMovieFav(movieId: number, userId: number) {
    const movieFound = await this.prisma.userFavoriteMovies.findMany({
      where: {
        movieId,
        userId: userId,
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
    const movieFound = await this.prisma.userFavoriteMovies.findMany({
      where: {
        movieId,
        userId: userId,
      },
    });
    if (movieFound) {
      throw new BadRequestException('Movie Not Found list');
    }

    const movieUni = await this.prisma.userFavoriteMovies.delete({
      where: {
        userId_movieId: {
          movieId,
          userId,
        },
      },
    });
    // console.log('success');
    return movieUni;
    // console.log(movieUni);
  }

  async getAllFavorites(userId: number) {
    return await this.prisma.userFavoriteMovies.findMany({
      where: {
        userId,
      },
    });
  }
}
