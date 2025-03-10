import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from '../dto/create-movie.dto';

@Injectable()
export class MovieCreateService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    const movieTitle = await this.prisma.movie.findUnique({
      where: { title: createMovieDto.title },
    });
    if (movieTitle) {
      throw new BadRequestException('Movie already exists with this title', {
        cause: new Error(),
        description: 'Try another title',
      });
    }

    return this.prisma.movie.create({
      data: { ...createMovieDto, authorId: createMovieDto.authorId },
    });
  }
}
