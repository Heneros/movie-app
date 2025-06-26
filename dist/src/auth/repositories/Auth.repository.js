"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const defaultData_1 = require("../../data/defaultData");
let AuthRepository = class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUser(criteria) {
        const { userId, email, logInDto, token } = criteria;
        const searchEmail = email || logInDto?.email;
        if (!userId && !searchEmail && !token) {
            throw new common_1.BadRequestException('Either userId, email or token must be provided');
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
    async findUserByEmail(data) {
        const { email } = data;
        if (!email) {
            throw new common_1.BadRequestException('Email not provided');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    async createUser(userData) {
        const createdUser = await this.prisma.user.create({
            data: userData,
        });
        return createdUser;
    }
    async createToken(criteria) {
        const { userId, token, tempDate } = criteria;
        return await this.prisma.verifyResetToken.create({
            data: {
                userId: userId,
                token: token,
                createdAt: new Date().toISOString(),
                expiresAt: tempDate,
            },
        });
    }
    async findToken(criteria) {
        const { userId, token } = criteria;
        if (!userId && !token) {
            throw new common_1.BadRequestException('Either userId must be provided');
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
    async updatePassword(userId, newPassword) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
    }
    async findTokenByUserId(userId) {
        return this.prisma.verifyResetToken.findUnique({
            where: { userId },
        });
    }
    async updateRefreshToken(userId, newRefreshTokens) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: newRefreshTokens },
        });
    }
    async createOrUpdateToken(userId, token) {
        console.log(token);
        return this.prisma.verifyResetToken.update({
            where: { userId },
            data: { token },
        });
    }
    async updateProfile(userId, updates) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { ...updates },
        });
    }
    async verifyUser(userId) {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
            },
        });
        return updatedUser;
    }
    async updateToken(userId, emailToken) {
        return this.prisma.verifyResetToken.upsert({
            where: { userId },
            update: {
                userId: userId,
                token: emailToken,
                expiresAt: defaultData_1.tempTokenDate,
            },
            create: {
                userId,
                token: emailToken,
                expiresAt: defaultData_1.tempTokenDate,
            },
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=Auth.repository.js.map