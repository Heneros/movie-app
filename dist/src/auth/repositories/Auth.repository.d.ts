import { PrismaService } from '@/prisma/prisma.service';
import { LogInDto } from '../dto-input/Login.dto';
export declare class AuthRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findUser(criteria: {
        userId?: number;
        logInDto?: LogInDto;
        email?: string;
        token?: string;
    }): Promise<{
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
    findUserByEmail(data: any): Promise<{
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
    createUser(userData: any): Promise<{
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
    createToken(criteria: {
        userId?: any;
        token?: any;
        tempDate?: any;
    }): Promise<{
        createdAt: Date;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
    findToken(criteria: {
        userId?: number;
        token?: string;
    }): Promise<{
        createdAt: Date;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
    deleteToken(user: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findFirstUser(user: any, refreshToken: any): Promise<{
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
    updatePassword(userId: number, newPassword: string): Promise<{
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
    findTokenByUserId(userId: number): Promise<{
        createdAt: Date;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
    updateRefreshToken(userId: number, newRefreshTokens: string[]): Promise<{
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
    createOrUpdateToken(userId: number, token: string): Promise<{
        createdAt: Date;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
    updateProfile(userId: number, updates: {
        refreshToken?: string[];
        name?: string;
        email?: string;
        profilePic?: string;
    }): Promise<{
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
    verifyUser(userId: number): Promise<{
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
    updateToken(userId: number, emailToken: string): Promise<{
        createdAt: Date;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
}
