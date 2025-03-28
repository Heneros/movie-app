import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { roundsOfHashing } from '@/data/defaultData';
import { LogInDto } from '../dto/login.dto';

@Injectable()
export class AuthRepository {
    constructor(private prisma: PrismaService) {}

    async findUser(logInDto: LogInDto) {
        const userEmail = await this.prisma.user.findUnique({
            where: { email: logInDto.email },
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
        const emailVerificationToken =
            await this.prisma.verifyResetToken.create({
                data: {
                    userId: createdUser.id,
                    token: tokenVerification,
                    expiresAt: tempRegisterDate,
                },
            });
        return emailVerificationToken;
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
            data: { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
        });

        return existingRefreshToken;
    }
}
