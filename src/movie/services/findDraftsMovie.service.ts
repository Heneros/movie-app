import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieFindDraftsService {
  constructor(private prisma: PrismaService) {}

  findDrafts() {
    return this.prisma.movie.findMany({ where: { published: false } });
  }
}
