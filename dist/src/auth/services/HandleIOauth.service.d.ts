import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { PrismaService } from '@/prisma/prisma.service';
interface OAuthUserData {
    email: string;
    name: string;
    avatarUrl: string;
    provider: string;
    providerId: string;
    password: string;
}
export declare class HandleIOauth {
    protected authRepository: AuthRepository;
    protected JwtService: JwtService;
    protected cloudinaryService: CloudinaryService;
    protected readonly prisma: PrismaService;
    constructor(authRepository: AuthRepository, JwtService: JwtService, cloudinaryService: CloudinaryService, prisma: PrismaService);
    protected handleOauthLogin(email: string): Promise<User>;
    uploadAvatarToCloudinary(avatarUrl: string, id: string): Promise<{
        url: string;
        publicId: string;
    }>;
    createUserViaOauth(userData: OAuthUserData): Promise<{
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
export {};
