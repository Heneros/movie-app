import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieRateService {
  constructor(private prisma: PrismaService) {}

  async rateMovie(
    movieId: number,
    userId: number,
    value: number,
  ): Promise<Movie | null> {
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: { movieId, userId },
      },
    });

    if (existingRating) {
      await this.prisma.rating.update({
        where: { id: existingRating.id },
        data: { value },
      });
    } else {
      await this.prisma.rating.create({
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

    return this.prisma.movie.update({
      where: { id: movieId },
      data: { avgRating: isNaN(avg) ? 0 : avg },
    });
  }
}
