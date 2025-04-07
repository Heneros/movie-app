import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRole } from '../dto/update-user-role.dto';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    async findAllUsers(skip: number) {
        return await this.prisma.user.findMany({
            skip: skip,
            // take: PAGINATION_LIMIT,
        });
    }

    async findIdUser(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto | string[]) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...updateUserDto,
            },
        });
    }

    async updateUserRole(id: number, updateUserDto: string[]) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                roles: updateUserDto,
            },
        });
    }

    async deleteUserAccount(id: number) {
        return this.prisma.$transaction(async (tx) => {
            await tx.verifyResetToken.deleteMany({
                where: { userId: id },
            });

            await tx.user.delete({
                where: { id },
            });
        });
    }
}
