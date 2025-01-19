import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PAGINATION_LIMIT } from 'src/data/defaultData';

@Injectable()
export class MovieService {
  private readonly paginationLimit: number;

  constructor(private prisma: PrismaService) {
    this.paginationLimit = Number(process.env.PAGINATION);
  }

  async create(createMovieDto: CreateMovieDto) {
    const movieTitle = await this.prisma.movie.findUnique({
      where: { title: createMovieDto.title },
    });
    if (movieTitle) {
      // throw new Error('Already exist');
      throw new BadRequestException('Movie already exists with this title', {
        cause: new Error(),
        description: 'Try another title',
      });
    }

    return this.prisma.movie.create({ data: createMovieDto });
  }

  async findAll(skip?: number, take?: number) {
    console.log(process.env.PAGINATION!);
    return this.prisma.movie.findMany({
      skip: Math.max(0, skip),
      take: this.paginationLimit,
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
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
}
