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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleIOauth = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const defaultData_1 = require("../../data/defaultData");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const Auth_repository_1 = require("../repositories/Auth.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
let HandleIOauth = class HandleIOauth {
    authRepository;
    JwtService;
    cloudinaryService;
    prisma;
    constructor(authRepository, JwtService, cloudinaryService, prisma) {
        this.authRepository = authRepository;
        this.JwtService = JwtService;
        this.cloudinaryService = cloudinaryService;
        this.prisma = prisma;
    }
    async handleOauthLogin(email) {
        let user = await this.authRepository.findUser({
            email: email,
        });
        const payload = {
            id: user.id,
            name: user.name,
            roles: user.roles,
        };
        const accessTokenJwt = await this.JwtService.signAsync(payload, {
            expiresIn: '15m',
        });
        const refreshTokenJwt = await this.JwtService.signAsync(payload, {
            expiresIn: '31d',
        });
        const token = await this.authRepository.findTokenByUserId(user.id);
        if (!token) {
            await this.authRepository.createToken({
                userId: user.id,
                token: refreshTokenJwt,
                tempDate: defaultData_1.tempRegisterDate,
            });
            return user;
        }
        else {
            await this.authRepository.deleteToken({
                where: { userId: user.id },
            });
            await this.authRepository.createToken({
                userId: user.id,
                token: refreshTokenJwt,
                tempDate: defaultData_1.tempRegisterDate,
            });
        }
        await this.authRepository.updateProfile(user.id, {
            refreshToken: [accessTokenJwt],
        });
        return user;
    }
    async uploadAvatarToCloudinary(avatarUrl, id) {
        if (!avatarUrl)
            return null;
        const publicId = `nestjsMoviedb/avatars/${id}_${Date.now()}`;
        return await this.cloudinaryService.uploadFromUrl(avatarUrl, publicId);
    }
    async createUserViaOauth(userData) {
        const { email, name, provider, avatarUrl, providerId, password } = userData;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const providerField = {
            [`${provider}Id`]: providerId,
        };
        const avatarPublicId = `nestjsMoviedb/avatars/${providerId}_${Date.now()}`;
        let cloudinaryAvatar = null;
        if (avatarUrl) {
            cloudinaryAvatar = await this.cloudinaryService.uploadFromUrl(avatarUrl, avatarPublicId);
        }
        return this.prisma.user.create({
            data: {
                email,
                name,
                isEmailVerified: true,
                password: hashedPassword,
                provider,
                ...providerField,
                avatar: cloudinaryAvatar
                    ? {
                        create: {
                            url: cloudinaryAvatar.url,
                            publicId: cloudinaryAvatar.publicId,
                        },
                    }
                    : undefined,
            },
        });
    }
};
exports.HandleIOauth = HandleIOauth;
exports.HandleIOauth = HandleIOauth = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        cloudinary_service_1.CloudinaryService,
        prisma_service_1.PrismaService])
], HandleIOauth);
//# sourceMappingURL=HandleIOauth.service.js.map