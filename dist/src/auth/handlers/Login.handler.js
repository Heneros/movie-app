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
exports.LoginUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const bcrypt = __importStar(require("bcrypt"));
const LoginUser_command_1 = require("../commands/LoginUser.command");
const Auth_repository_1 = require("../repositories/Auth.repository");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let LoginUserHandler = class LoginUserHandler {
    authRepository;
    jwtService;
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async execute(command) {
        const { logInDto } = command;
        try {
            const user = await this.authRepository.findUser({
                email: logInDto.email,
            });
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            if (user.blocked) {
                throw new common_1.BadRequestException('User is blocked');
            }
            const isPasswordValid = await bcrypt.compare(logInDto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Invalid password');
            }
            const payload = {
                id: user.id,
                name: user.name,
                roles: user.roles,
            };
            const accessToken = await this.jwtService.signAsync(payload, {
                expiresIn: '15m',
            });
            const refreshToken = await this.jwtService.signAsync(payload, {
                expiresIn: '31d',
            });
            await this.authRepository.deleteToken({
                where: { userId: user.id },
            });
            await this.authRepository.updateToken(user.id, refreshToken);
            await this.authRepository.updateProfile(user.id, {
                refreshToken: [refreshToken],
            });
            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.LoginUserHandler = LoginUserHandler;
exports.LoginUserHandler = LoginUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(LoginUser_command_1.LoginUserCommand),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], LoginUserHandler);
//# sourceMappingURL=Login.handler.js.map