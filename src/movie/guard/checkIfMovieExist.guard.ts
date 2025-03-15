import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CheckMovieExistPipe implements PipeTransform {
    constructor(private prisma: PrismaService) {}

    async transform(id: number) {
        if (!id || isNaN(id)) {
            throw new BadRequestException('Either movieId must be provided');
        }

        const movie = await this.prisma.movie.findUnique({
            where: {
                id,
            },
        });

        if (!movie) {
            throw new BadRequestException('No movie exists with this id');
        }

        return id;
    }
}
