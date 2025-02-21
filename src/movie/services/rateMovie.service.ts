import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieRateService {
  constructor(private prisma: PrismaService) {}

  async rateMovie(
    movieId: number,
    userId: number,
    value: number,
  ): Promise<Movie> {
    if (value < 1 || value > 10) {
      throw new BadRequestException('Rating value must be between 1 and 10');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          movieId,
          userId,
        },
      },
    });

    // console.log(existingRating);
    let rating;

    if (existingRating) {
      rating = await this.prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          value,
        },
      });
    } else {
      rating = await this.prisma.rating.create({
        data: {
          value,
          user: { connect: { id: userId } },
          movie: { connect: { id: movieId } },
        },
      });
    }

    const ratings = await this.prisma.rating.findMany({
      where: { movieId },
      select: { value: true },
    });

    const total = ratings.reduce((sum, r) => sum + r.value, 0);
    const avg = ratings.length > 0 ? total / ratings.length : 0;
    // console.log(avg);

    return await this.prisma.movie.update({
      where: { id: movieId },
      // data: { avgRating: avg },
      data: { avgRating: isNaN(avg) ? 0 : avg },
    });

    // return rating;
  }
}
