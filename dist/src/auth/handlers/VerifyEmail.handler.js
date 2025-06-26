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
exports.VerifyEmailHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("../queries");
const Auth_repository_1 = require("../repositories/Auth.repository");
const mail_service_1 = require("../../mail/mail.service");
const common_1 = require("@nestjs/common");
let VerifyEmailHandler = class VerifyEmailHandler {
    authRepository;
    mailService;
    constructor(authRepository, mailService) {
        this.authRepository = authRepository;
        this.mailService = mailService;
    }
    async execute(query) {
        const { userId, token } = query;
        const user = await this.authRepository.findUser({ userId: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found ');
        }
        if (user?.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const emailVerificationToken = await this.authRepository.findToken({
            userId: user.id,
            token,
        });
        if (!emailVerificationToken) {
            throw new common_1.BadRequestException('Not found token');
        }
        if (new Date() > emailVerificationToken.expiresAt) {
            throw new common_1.BadRequestException('Expired token or invalid token');
        }
        await this.authRepository.verifyUser(emailVerificationToken.userId);
        await this.authRepository.updateToken(emailVerificationToken.userId, emailVerificationToken.token);
        await this.mailService.sendEmail(false, user, 'Your email is verified!', './welcome', emailVerificationToken);
        return {
            id: user.id,
            message: 'Your email is verified!',
        };
    }
};
exports.VerifyEmailHandler = VerifyEmailHandler;
exports.VerifyEmailHandler = VerifyEmailHandler = __decorate([
    (0, cqrs_1.QueryHandler)(queries_1.VerifyEmailQuery),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        mail_service_1.MailService])
], VerifyEmailHandler);
//# sourceMappingURL=VerifyEmail.handler.js.map