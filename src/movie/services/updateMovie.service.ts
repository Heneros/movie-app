import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { Movie } from '@prisma/client';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieUpdateService {
  constructor(private prisma: PrismaService) {}

  update(id: number, updateMovieDto: UpdateMovieDto) {
    try {
      return this.prisma.movie.update({
        where: { id },
        data: updateMovieDto,
      });
    } catch (error) {
      console.error('Error updating movie:', error);
      throw new BadRequestException('Invalid data format');
    }
  }
}
