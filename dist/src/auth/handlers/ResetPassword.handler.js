"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const bcrypt = __importStar(require("bcrypt"));
const commands_1 = require("../commands");
const Auth_repository_1 = require("../repositories/Auth.repository");
const mail_service_1 = require("../../mail/mail.service");
const common_1 = require("@nestjs/common");
const defaultData_1 = require("../../data/defaultData");
const cache_manager_1 = require("@nestjs/cache-manager");
let ResetPasswordHandler = class ResetPasswordHandler {
    cacheManager;
    authRepository;
    mailService;
    constructor(cacheManager, authRepository, mailService) {
        this.cacheManager = cacheManager;
        this.authRepository = authRepository;
        this.mailService = mailService;
    }
    async execute(command) {
        const { userId, resetPasswordDto } = command;
        if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
            throw new common_1.BadRequestException('Password do not match');
        }
        const verificationToken = await this.authRepository.findToken({
            userId,
        });
        if (!verificationToken || new Date() > verificationToken.expiresAt) {
            throw new common_1.BadRequestException('Your token is either invalid or expired. Try resetting your password again');
            return;
        }
        const user = await this.authRepository.findUser({
            userId,
        });
        if (user && verificationToken) {
            const newPass = await bcrypt.hash(resetPasswordDto.password, defaultData_1.roundsOfHashing);
            const updateUser = await this.authRepository.updatePassword(user.id, newPass);
            const payload = {
                name: updateUser.name,
                link: null,
            };
            await this.mailService.resendEmail(updateUser, 'Your password was reset successfully!', './resetPassword', payload);
            return {
                message: 'Your password was reset successfully!',
            };
        }
    }
};
exports.ResetPasswordHandler = ResetPasswordHandler;
exports.ResetPasswordHandler = ResetPasswordHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.ResetPasswordCommand),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Auth_repository_1.AuthRepository,
        mail_service_1.MailService])
], ResetPasswordHandler);
//# sourceMappingURL=ResetPassword.handler.js.map