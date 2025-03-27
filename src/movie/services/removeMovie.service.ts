import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MovieRemoveService {
    constructor(private prisma: PrismaService) {}

    remove(id: number) {
        return this.prisma.movie.delete({ where: { id } });
    }
}
