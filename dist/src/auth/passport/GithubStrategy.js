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
exports.GithubStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_github2_1 = require("passport-github2");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Auth_repository_1 = require("../repositories/Auth.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const services_1 = require("../services");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    authRepository;
    prisma;
    handleIOauth;
    cloudinaryService;
    constructor(authRepository, prisma, handleIOauth, cloudinaryService, config) {
        super({
            clientID: config.get('GITHUB_CLIENT_ID'),
            clientSecret: config.get('GITHUB_CLIENT_SECRET'),
            callbackURL: config.get('GITHUB_CALLBACK_URL'),
            proxy: true,
            scope: ['user:email'],
        });
        this.authRepository = authRepository;
        this.prisma = prisma;
        this.handleIOauth = handleIOauth;
        this.cloudinaryService = cloudinaryService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { displayName, emails, id } = profile;
        const email = profile?.emails?.[0]?.value;
        if (!email) {
            throw new common_1.NotFoundException('Email not found');
        }
        const user = await this.authRepository.findUser({
            email,
        });
        if (user?.blocked) {
            throw new common_1.BadRequestException('User is blocked');
        }
        if (user) {
            return user;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(profile.id, salt);
        const userData = {
            providerId: id,
            email,
            name: displayName,
            provider: profile.provider,
            password: hashedPassword,
            avatarUrl: profile._json.avatar_url,
        };
        await this.handleIOauth.createUserViaOauth({
            ...userData,
        });
        return {
            email: email,
            name: displayName || 'Unknown',
            avatar: profile._json.avatar_url,
            githubId: id,
            accessToken,
            refreshToken,
        };
    }
};
exports.GithubStrategy = GithubStrategy;
exports.GithubStrategy = GithubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        prisma_service_1.PrismaService,
        services_1.HandleIOauth,
        cloudinary_service_1.CloudinaryService,
        config_1.ConfigService])
], GithubStrategy);
//# sourceMappingURL=GithubStrategy.js.map