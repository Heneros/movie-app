import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PAGINATION_LIMIT } from 'src/data/defaultData';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieService {
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

  async findAll(skip: number = 0) {
    return this.prisma.movie.findMany({
      skip,
      take: PAGINATION_LIMIT,
      orderBy: {
        id: 'asc',
      },
    });
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

  async searchByTitle(title: string): Promise<Movie[]> {
    try {
      return await this.prisma.movie.findMany({
        where: {
          title: {
            contains: title,
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
