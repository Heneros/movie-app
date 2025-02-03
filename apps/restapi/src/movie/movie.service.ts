import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PAGINATION_LIMIT } from '../data/defaultData';
import { Movie } from '@prisma/client';
import { SearchMovieDto } from './dto/search-movie.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

  async findAll(skip: number = 0) {
    const cacheKey = `movies:${skip}`;

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      const ttl = await this.cacheManager.ttl(cacheKey);

      const remainingTime = ttl > 0 ? (ttl - Date.now()) / 1000 : ttl;
      console.log(`Cache hit: ${cacheKey}, TTL: ${remainingTime} seconds`);
      return cachedData;
    }

    const allMovies = await this.prisma.movie.findMany({
      skip,
      take: PAGINATION_LIMIT,
      orderBy: {
        id: 'asc',
      },
    });

    await this.cacheManager.set(cacheKey, allMovies, 3500);
    return allMovies;
  }

  async findOne(id: number): Promise<Movie | null> {
    try {
      return await this.prisma.movie.findUnique({
        where: {
          id: id,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      console.error('Error finding movie:', error);
      return null;
    }
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  remove(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }

  findDrafts() {
    return this.prisma.movie.findMany({ where: { published: false } });
  }

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
