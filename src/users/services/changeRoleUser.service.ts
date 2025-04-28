import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserRole } from '../dto-input/update-user-role.dto';
import { Request } from 'express';

@Injectable()
export class ChangeRoleService {
    constructor(private prisma: PrismaService) {}

    async changeRole(req: Request, id: number, updateUserRole: UpdateUserRole) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        const updatedRoles = Array.from(
            new Set([...existingUser.roles, ...req.body.roles]),
        );

        return this.prisma.user.update({
            where: { id },
            data: {
                roles: updatedRoles,
            },
        });
    }
}
