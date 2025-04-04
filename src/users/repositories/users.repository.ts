import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    async findAllUsers(skip: number) {
        return await this.prisma.user.findMany({
            skip: skip,
            take: PAGINATION_LIMIT,
        });
    }
}
