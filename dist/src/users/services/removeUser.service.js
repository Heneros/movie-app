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
exports.RemoveUserAccountService = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let RemoveUserAccountService = class RemoveUserAccountService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async remove(id) {
        const userIsAdmin = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userIsAdmin) {
            throw new common_1.ForbiddenException('User not found');
        }
        if (!userIsAdmin.roles?.includes['Admin']) {
            throw new common_1.ForbiddenException('Admin cannot delete their own account');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.verifyResetToken.deleteMany({
                where: { userId: id },
            });
            return tx.user.delete({
                where: { id },
            });
        });
    }
};
exports.RemoveUserAccountService = RemoveUserAccountService;
exports.RemoveUserAccountService = RemoveUserAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RemoveUserAccountService);
//# sourceMappingURL=removeUser.service.js.map