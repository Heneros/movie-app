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
exports.UsersRepository = void 0;
const defaultData_1 = require("../../data/defaultData");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let UsersRepository = class UsersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllUsers(skip) {
        return await this.prisma.user.findMany({
            skip: skip,
            take: defaultData_1.PAGINATION_LIMIT,
        });
    }
    async findAllBlockedUsers(skip) {
        return await this.prisma.user.findMany({
            skip: skip,
            where: {
                blocked: true,
            },
            take: defaultData_1.PAGINATION_LIMIT,
        });
    }
    async findIdUser(id) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async updateUser(id, updateUserDto) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...updateUserDto,
            },
        });
    }
    async updateUserRole(id, updateUserDto) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                roles: updateUserDto,
            },
        });
    }
    async deleteUserAccount(id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.verifyResetToken.deleteMany({
                where: { userId: id },
            });
            await tx.reviews.deleteMany({
                where: { id },
            });
            await tx.userFavoriteMovies.deleteMany({
                where: { userId: id },
            });
            await tx.rating.deleteMany({
                where: { userId: id },
            });
            await tx.avatar.deleteMany({
                where: { id },
            });
            await tx.user.delete({
                where: { id },
            });
        });
    }
    async banUserAccount(id) {
        return await this.prisma.user.update({
            where: { id },
            data: { blocked: true, refreshToken: [] },
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map