import { PrismaService } from '@/prisma/prisma.service';
export declare class DeactivateUserService {
    private prisma;
    constructor(prisma: PrismaService);
    deactivate(id: number): Promise<{
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
