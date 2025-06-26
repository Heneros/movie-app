import { PrismaService } from '@/prisma/prisma.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { HandleIOauth } from './HandleIOauth.service';
import { JwtService } from '@nestjs/jwt';
export declare class GoogleService extends HandleIOauth {
    protected readonly authRepository: AuthRepository;
    protected readonly JwtService: JwtService;
    protected readonly cloudinaryService: CloudinaryService;
    protected readonly prisma: PrismaService;
    constructor(authRepository: AuthRepository, JwtService: JwtService, cloudinaryService: CloudinaryService, prisma: PrismaService);
    validateGoogleUser(profile: any): Promise<{
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
    getGoogleUserByToken(token: string): Promise<{
        email: string;
        name: string;
    }>;
}
