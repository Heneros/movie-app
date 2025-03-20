import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieFindDraftsService {
    constructor(private prisma: PrismaService) {}

    findDrafts(skip: number) {
        return this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: { published: false },
        });
    }
}
