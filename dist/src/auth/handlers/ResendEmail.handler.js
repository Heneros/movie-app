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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendEmailHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const crypto_1 = require("crypto");
const mail_service_1 = require("../../mail/mail.service");
const Auth_repository_1 = require("../repositories/Auth.repository");
const common_1 = require("@nestjs/common");
const defaultData_1 = require("../../data/defaultData");
const commands_1 = require("../commands");
const nest_winston_1 = require("nest-winston");
let ResendEmailHandler = class ResendEmailHandler {
    logger;
    authRepository;
    mailService;
    constructor(logger, authRepository, mailService) {
        this.logger = logger;
        this.authRepository = authRepository;
        this.mailService = mailService;
    }
    async execute(command) {
        try {
            const { userId, email } = command;
            const user = await this.authRepository.findUserByEmail({
                email,
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.isEmailVerified) {
                throw new common_1.BadRequestException('User already verified');
            }
            const verificationToken = await this.authRepository.findToken({
                userId,
            });
            if (verificationToken) {
                await this.authRepository.deleteToken({
                    userId,
                });
            }
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            const emailToken = await this.authRepository.createToken({
                userId,
                token,
                tempDate: defaultData_1.tempRegisterDate,
            });
            const emailLink = `${defaultData_1.domain}/auth/verify/${emailToken.token}/${user.id}`;
            const payload = {
                name: user.name,
                link: emailLink,
            };
            await this.mailService.resendEmail(user, 'Welcome to Movie App! Confirm your Email ', './confirmation', payload);
            return {
                message: 'Email was successfully sent',
                status: 200,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.log(`Error verify user email ${command.email}`);
            throw new common_1.BadRequestException('Error sending email');
        }
    }
};
exports.ResendEmailHandler = ResendEmailHandler;
exports.ResendEmailHandler = ResendEmailHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.ResendEmailCommand),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [Object, Auth_repository_1.AuthRepository,
        mail_service_1.MailService])
], ResendEmailHandler);
//# sourceMappingURL=ResendEmail.handler.js.map