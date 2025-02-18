import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MovieFindDraftsService {
  constructor(private prisma: PrismaService) {}

  findDrafts() {
    return this.prisma.movie.findMany({ where: { published: false } });
  }
}
