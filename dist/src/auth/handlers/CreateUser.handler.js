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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const CreateUser_command_1 = require("../commands/CreateUser.command");
const mail_service_1 = require("../../mail/mail.service");
const Auth_repository_1 = require("../repositories/Auth.repository");
const common_1 = require("@nestjs/common");
const defaultData_1 = require("../../data/defaultData");
let CreateUserHandler = class CreateUserHandler {
    authRepository;
    mailService;
    constructor(authRepository, mailService) {
        this.authRepository = authRepository;
        this.mailService = mailService;
    }
    async execute(command) {
        const { createUserDto } = command;
        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new common_1.BadRequestException('Confirm password');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, defaultData_1.roundsOfHashing);
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        createUserDto.password = hashedPassword;
        let email = createUserDto.email;
        const userEmail = await this.authRepository.findUser({ email });
        if (userEmail) {
            throw new common_1.BadRequestException('User already exists with this email', {
                cause: new Error(),
                description: 'Try another email',
            });
        }
        const userData = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        };
        const createdUser = await this.authRepository.createUser(userData);
        const userId = createdUser.id;
        const emailVerificationToken = await this.authRepository.createToken({
            userId,
            token,
            tempDate: defaultData_1.tempRegisterDate,
        });
        await this.mailService.sendEmail(true, {
            ...createdUser,
            email: createUserDto.email,
        }, 'Welcome to Movie App! Confirm your Email ', './confirmation', emailVerificationToken);
        return {
            id: userId,
            email: createUserDto.email,
            name: createUserDto.name,
            accessToken: emailVerificationToken.token,
        };
    }
};
exports.CreateUserHandler = CreateUserHandler;
exports.CreateUserHandler = CreateUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(CreateUser_command_1.CreateUserCommand),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        mail_service_1.MailService])
], CreateUserHandler);
//# sourceMappingURL=CreateUser.handler.js.map