import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from '../dto-input/update-user.dto';
export declare class UpdateUserService {
    private prisma;
    constructor(prisma: PrismaService);
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
