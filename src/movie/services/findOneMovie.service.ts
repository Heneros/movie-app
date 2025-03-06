import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieFindOneService {
  private readonly logger = new Logger(MovieFindOneService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<Movie | null> {
    try {
      // this.logger.log('Test');
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
}
