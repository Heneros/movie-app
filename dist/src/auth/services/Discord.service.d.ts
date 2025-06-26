import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { JwtService } from '@nestjs/jwt';
import { HandleIOauth } from './HandleIOauth.service';
import { PrismaService } from '@/prisma/prisma.service';
export declare class DiscordService extends HandleIOauth {
    protected readonly authRepository: AuthRepository;
    protected readonly JwtService: JwtService;
    protected readonly cloudinaryService: CloudinaryService;
    protected readonly prisma: PrismaService;
    constructor(authRepository: AuthRepository, JwtService: JwtService, cloudinaryService: CloudinaryService, prisma: PrismaService);
    validateDiscordUser(profile: any): Promise<{
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
