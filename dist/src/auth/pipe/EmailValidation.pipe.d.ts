import { PipeTransform } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
export declare class EmailValidationPipe implements PipeTransform {
    private prisma;
    constructor(prisma: PrismaService);
    transform(value: {
        userId?: number;
        email?: string;
    }): Promise<{
        userId?: number;
        email?: string;
    }>;
}
