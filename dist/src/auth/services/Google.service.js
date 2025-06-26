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
exports.GoogleService = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const Auth_repository_1 = require("../repositories/Auth.repository");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const HandleIOauth_service_1 = require("./HandleIOauth.service");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = __importDefault(require("axios"));
let GoogleService = class GoogleService extends HandleIOauth_service_1.HandleIOauth {
    authRepository;
    JwtService;
    cloudinaryService;
    prisma;
    constructor(authRepository, JwtService, cloudinaryService, prisma) {
        super(authRepository, JwtService, cloudinaryService, prisma);
        this.authRepository = authRepository;
        this.JwtService = JwtService;
        this.cloudinaryService = cloudinaryService;
        this.prisma = prisma;
    }
    async validateGoogleUser(profile) {
        try {
            return await this.handleOauthLogin(profile.email);
        }
        catch (error) {
            throw new common_1.BadRequestException('Something wrong happened');
        }
    }
    async getGoogleUserByToken(token) {
        const response = await axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};
exports.GoogleService = GoogleService;
exports.GoogleService = GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        cloudinary_service_1.CloudinaryService,
        prisma_service_1.PrismaService])
], GoogleService);
//# sourceMappingURL=Google.service.js.map