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
exports.EmailValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EmailValidationPipe = class EmailValidationPipe {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transform(value) {
        if (!value.userId && !value.email) {
            throw new common_1.BadRequestException('Either userId or email must be provided');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: value.userId,
                email: value.email,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('No user exists with this email');
        }
        if (!user.isEmailVerified) {
            throw new common_1.BadRequestException('Email not verified');
        }
        if (user.blocked) {
            throw new common_1.BadRequestException('User is blocked');
        }
        return value;
    }
};
exports.EmailValidationPipe = EmailValidationPipe;
exports.EmailValidationPipe = EmailValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailValidationPipe);
//# sourceMappingURL=EmailValidation.pipe.js.map