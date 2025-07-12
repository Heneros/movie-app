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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const services_1 = require("../services");
const Auth_repository_1 = require("../repositories/Auth.repository");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    config;
    handleIOauth;
    authRepository;
    constructor(config, handleIOauth, authRepository) {
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.get('GOOGLE_CALLBACK_URL'),
            proxy: true,
            scope: ['email', 'profile'],
        });
        this.config = config;
        this.handleIOauth = handleIOauth;
        this.authRepository = authRepository;
        if (process.env.NODE_ENV === 'test') {
            return;
        }
    }
    async validate(accessToken, refreshToken, profile) {
        const { displayName, emails, photos, id } = profile;
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
        console.log(profile);
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(profile.id, salt);
        const userData = {
            providerId: id,
            email,
            name: displayName,
            provider: profile.provider,
            password: hashedPassword,
            avatarUrl: profile._json.picture,
        };
        await this.handleIOauth.createUserViaOauth({
            ...userData,
        });
        return {
            email: emails[0].value,
            name: displayName,
            avatar: photos?.[0]?.value,
            googleId: id,
            accessToken,
        };
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        services_1.HandleIOauth,
        Auth_repository_1.AuthRepository])
], GoogleStrategy);
//# sourceMappingURL=GoogleStrategy.js.map