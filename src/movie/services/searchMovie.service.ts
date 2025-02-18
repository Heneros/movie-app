import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieSearchService {
  constructor(private prisma: PrismaService) {}
  async searchByTitle(searchMovieDto: SearchMovieDto): Promise<Movie[]> {
    try {
      return await this.prisma.movie.findMany({
        where: {
          title: {
            contains: searchMovieDto.title,
            mode: 'insensitive',
          },
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }
}
