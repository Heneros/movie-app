import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieFindOneService {
    constructor(private prisma: PrismaService) {}

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
}
