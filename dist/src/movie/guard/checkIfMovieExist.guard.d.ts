import { PrismaService } from '@/prisma/prisma.service';
import { PipeTransform } from '@nestjs/common';
export declare class CheckMovieExistPipe implements PipeTransform {
    private prisma;
    constructor(prisma: PrismaService);
    transform(id: number): Promise<number>;
}
