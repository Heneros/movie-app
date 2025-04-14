import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { roundsOfHashing, tempLoginDate } from '@/data/defaultData';
import { LogInDto } from '../dto/Login.dto';
import { EmailDto } from '../dto/Resend-email.dto';

@Injectable()
export class AuthRepository {
    constructor(private prisma: PrismaService) {}

    async findUser(criteria: {
        userId?: number;
        logInDto?: LogInDto;
        email?: string;
        token?: string;
    }) {
        const { userId, email, logInDto, token } = criteria;
        const searchEmail = email || logInDto?.email;
        // console.log(userId, email, logInDto, token);
        if (!userId && !searchEmail && !token) {
            throw new BadRequestException(
                'Either userId, email or token must be provided',
            );
        }
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    ...(userId ? [{ id: userId }] : []),
                    ...(searchEmail ? [{ email: searchEmail }] : []),
                    ...(token ? [{ refreshToken: { has: token } }] : []),
                ],
            },
        });
    }

    async createUser(userData) {
        const createdUser = await this.prisma.user.create({
            data: userData,
        });
        return createdUser;
    }

    async createToken(criteria: { userId?; token?; tempDate? }) {
        const { userId, token, tempDate } = criteria;

        return await this.prisma.verifyResetToken.create({
            data: {
                userId: userId,
                token: token,
                createdAt: new Date().toISOString(),
                expiresAt: tempDate,
            },
        });
        // return emailVerificationToken;
    }

    async findToken(criteria: { userId?: number; token?: string }) {
        const { userId, token } = criteria;

        if (!userId && !token) {
            throw new BadRequestException('Either userId must be provided');
        }
        const userEmail = await this.prisma.verifyResetToken.findUnique({
            where: {
                userId,
                token,
            },
        });
        return userEmail;
    }

    async deleteToken(user) {
        return await this.prisma.verifyResetToken.deleteMany({
            where: { userId: user.id },
        });
    }

    async findFirstUser(user, refreshToken) {
        const existingRefreshToken = await this.prisma.user.findFirst({
            where: {
                id: user.id,
                refreshToken: { hasSome: [refreshToken] },
            },
        });

        return existingRefreshToken;
    }

    async updatePassword(userId: number, newPassword: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
    }

    async findTokenByUserId(userId: number) {
        return this.prisma.verifyResetToken.findUnique({
            where: { userId },
        });
    }

    async updateRefreshToken(userId: number, newRefreshTokens: string[]) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: newRefreshTokens },
        });
    }

    async createOrUpdateToken(userId: number, token: string) {
        return this.prisma.verifyResetToken.update({
            where: { userId },
            data: { token },
        });
    }

    async updateProfile(
        userId: number,
        updates: {
            refreshToken?: string[];
            name?: string;
            email?: string;
            profilePic?: string;
        },
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { ...updates },
        });
    }

    async verifyUser(userId: number) {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
            },
        });

        return updatedUser;
    }
    async updateToken(userId: number, emailToken: string) {
        return this.prisma.verifyResetToken.upsert({
            where: { userId },
            update: {
                userId: userId,
                token: emailToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                userId,
                token: emailToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    }
}
