import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserRole } from '../dto-input/update-user-role.dto';
import { Request } from 'express';
export declare class ChangeRoleService {
    private prisma;
    constructor(prisma: PrismaService);
    changeRole(req: Request, id: number, updateUserRole: UpdateUserRole): Promise<{
        name: string;
        email: string;
        password: string;
        id: number;
        createdAt: Date;
        roles: string[];
        updatedAt: Date;
        isEmailVerified: boolean;
        refreshToken: string[];
        blocked: boolean;
        provider: string | null;
        googleId: string | null;
        githubId: string | null;
        discordId: string | null;
    }>;
}
