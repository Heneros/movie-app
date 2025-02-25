import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { Movie } from '@prisma/client';
import { PAGINATION_LIMIT } from '@/data/defaultData';

@Injectable()
export class MovieSearchService {
  constructor(private prisma: PrismaService) {}
  async searchByTitle(searchText: string, skip: number = 0): Promise<Movie[]> {
    console.log(searchText);

    try {
      return await this.prisma.movie.findMany({
        skip,
        take: PAGINATION_LIMIT,
        where: {
          title: {
            contains: searchText,
            mode: 'insensitive',
          },
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new BadRequestException('Failed to search movies');
    }
  }
}
