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
exports.ResetPasswordRequestHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const crypto_1 = require("crypto");
const mail_service_1 = require("../../mail/mail.service");
const Auth_repository_1 = require("../repositories/Auth.repository");
const defaultData_1 = require("../../data/defaultData");
const commands_1 = require("../commands");
const common_1 = require("@nestjs/common");
let ResetPasswordRequestHandler = class ResetPasswordRequestHandler {
    authRepository;
    mailService;
    constructor(authRepository, mailService) {
        this.authRepository = authRepository;
        this.mailService = mailService;
    }
    async execute(command) {
        const { userId, resendEmailDto, res } = command;
        const user = await this.authRepository.findUser({
            email: resendEmailDto,
            userId,
        });
        const verificationToken = await this.authRepository.findToken({
            userId,
        });
        if (!user) {
            throw new common_1.BadRequestException('No user exist');
        }
        if (verificationToken) {
            await this.authRepository.deleteToken({
                userId: user.id,
            });
        }
        const resentToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const emailToken = await this.authRepository.createToken({
            userId: user.id,
            token: resentToken,
            tempDate: defaultData_1.tempRegisterDate,
        });
        const emailLink = `${defaultData_1.domain}/auth/reset_password?emailToken=${emailToken.token}&userId=${user.id}`;
        const payload = {
            name: user.name,
            link: emailLink,
        };
        await this.mailService.resendEmail(user, 'Password Reset Request', './requestResetPassword', payload);
        res.status(200).json({
            message: 'Password Reset Request',
        });
    }
};
exports.ResetPasswordRequestHandler = ResetPasswordRequestHandler;
exports.ResetPasswordRequestHandler = ResetPasswordRequestHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.ResetPasswordRequestCommand),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        mail_service_1.MailService])
], ResetPasswordRequestHandler);
//# sourceMappingURL=ResetPasswordRequest.handler.js.map