import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { Movie } from '@prisma/client';
import { SearchMovieDto } from './dto/search-movie.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}
}
