import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchMovieDto } from '../dto/search-movie.dto';
import { Movie } from '@prisma/client';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieRemoveService {
  constructor(private prisma: PrismaService) {}

  remove(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }
}
