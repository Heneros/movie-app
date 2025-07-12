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
exports.CheckUserExistPipe = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let CheckUserExistPipe = class CheckUserExistPipe {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transform(id) {
        if (!id || isNaN(id)) {
            throw new common_1.BadRequestException('Either userId must be provided 4');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('No user exists with this email');
        }
        if (user.blocked) {
            throw new common_1.BadRequestException('User is blocked');
        }
        return id;
    }
};
exports.CheckUserExistPipe = CheckUserExistPipe;
exports.CheckUserExistPipe = CheckUserExistPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckUserExistPipe);
//# sourceMappingURL=CheckUserExist.pipe.js.map