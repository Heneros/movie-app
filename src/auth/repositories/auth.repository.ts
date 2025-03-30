import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/Create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { roundsOfHashing, tempLoginDate } from '@/data/defaultData';
import { LogInDto } from '../dto/Login.dto';

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
        if (!userId && !email && !logInDto && !token) {
            throw new BadRequestException(
                'Either userId or email must be provided',
            );
        }
        const userEmail = await this.prisma.user.findUnique({
            where: {
                ...(logInDto && logInDto.email && { email: logInDto.email }),
                ...(email && { email: email }),
                ...(userId && { id: userId }),
                ...(token ? { refreshToken: { has: token } } : []),
            },
        });
        return userEmail;
    }

    async createUser(userData) {
        const createdUser = await this.prisma.user.create({
            data: userData,
        });
        return createdUser;
    }

    async createToken(createdUser, tokenVerification, tempRegisterDate) {
        //   const emailVerificationToken =
        return await this.prisma.verifyResetToken.create({
            data: {
                userId: createdUser.id,
                token: tokenVerification,
                expiresAt: tempRegisterDate,
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
                token: token,
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

    async updateUser(user, newRefreshTokenArray, newRefreshToken) {
        const existingRefreshToken = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: [...newRefreshTokenArray, newRefreshToken],
            },
        });

        return existingRefreshToken;
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
    async updatedToken(userId: number, emailToken: string) {
        const updatedUser = await this.prisma.verifyResetToken.update({
            where: {
                userId,
                token: emailToken,
            },
            data: {
                expiresAt: tempLoginDate,
            },
        });

        return updatedUser;
    }
}
