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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_entity_1 = require("./entity-objectType/auth.entity");
const Login_dto_1 = require("./dto-input/Login.dto");
const timeout_interceptor_1 = require("../interceptor/timeout.interceptor");
const user_entity_1 = require("../users/entities-objectType/user.entity");
const Create_user_dto_1 = require("./dto-input/Create-user.dto");
const Reset_password_dto_1 = require("./dto-input/Reset-password.dto");
const register_entity_1 = require("./entity-objectType/register.entity");
const EmailValidation_pipe_1 = require("./pipe/EmailValidation.pipe");
const cqrs_1 = require("@nestjs/cqrs");
const index_1 = require("./commands/index");
const site_constants_1 = require("../sites/site.constants");
const queries_1 = require("./queries");
const Resend_email_dto_1 = require("./dto-input/Resend-email.dto");
const throttler_1 = require("@nestjs/throttler");
const defaultData_1 = require("../data/defaultData");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const services_1 = require("./services");
let AuthController = class AuthController {
    commandBus;
    queryBus;
    googleService;
    githubService;
    discordService;
    jwt;
    constructor(commandBus, queryBus, googleService, githubService, discordService, jwt) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.googleService = googleService;
        this.githubService = githubService;
        this.discordService = discordService;
        this.jwt = jwt;
    }
    async create(createUserDto) {
        return await this.commandBus.execute(new index_1.CreateUserCommand(createUserDto));
    }
    async verifyEmail(token, userId) {
        return await this.queryBus.execute(new queries_1.VerifyEmailQuery(token, userId));
    }
    async login(req, res, logInDto) {
        try {
            const result = await this.commandBus.execute(new index_1.LoginUserCommand(logInDto));
            res.cookie('jwtMovie', result.refreshToken, {
                httpOnly: !defaultData_1.isDevelopment,
                sameSite: defaultData_1.isDevelopment ? 'none' : 'strict',
                maxAge: 31 * 24 * 60 * 60 * 1000,
                secure: !defaultData_1.isDevelopment,
            });
            return new auth_entity_1.AuthEntity({
                message: 'Login successful',
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                name: result.user.name,
                id: result.user.id,
                email: result.user.email,
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadGatewayException(error.message || 'Authentication failed');
        }
    }
    async resendEmailValidation(userId, emailDto) {
        const result = await this.commandBus.execute(new index_1.ResendEmailCommand(userId, emailDto.email));
        return new auth_entity_1.AuthEntity(result);
    }
    async requestResetPassword(userId, emailDto, res) {
        return await this.commandBus.execute(new index_1.ResetPasswordRequestCommand(userId, emailDto.email, res));
    }
    async resetPassword(userId, emailToken, resetPasswordDto) {
        return await this.commandBus.execute(new index_1.ResetPasswordCommand(userId, emailToken, resetPasswordDto));
    }
    async logout(req, res) {
        const message = await this.commandBus.execute(new index_1.LogoutCommand(req, res));
        res.status(200).json({ message });
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        try {
            const user = await this.googleService.validateGoogleUser(req.user);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });
            return res
                .cookie('jwtMovie', token, {
                httpOnly: true,
                sameSite: !defaultData_1.isDevelopment ? 'lax' : 'strict',
                maxAge: 31 * 24 * 60 * 60 * 1000,
                secure: !defaultData_1.isDevelopment,
            })
                .redirect('/');
        }
        catch (error) {
            console.error('Google Auth Error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadGatewayException(error.message || 'Authentication failed');
        }
    }
    githubAuth() {
    }
    async githubAuthCallback(req, res) {
        try {
            const user = await this.githubService.validateGithubUser(req.user);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });
            res.cookie('jwtMovie', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).redirect('/');
        }
        catch (error) {
            res.redirect('/auth-error');
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadGatewayException(error.message || 'Authentication failed');
        }
    }
    discordAuth() {
    }
    async discordAuthCallback(req, res) {
        try {
            const user = await this.discordService.validateDiscordUser(req.user);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const token = this.jwt.sign({
                userId: user.id,
                name: user.name,
                roles: user.roles,
            });
            res.cookie('jwtMovie', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).redirect('/');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadGatewayException(error.message || 'Authentication failed');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.REGISTER),
    (0, swagger_1.ApiOperation)({ summary: 'Create user' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The user has been successfully created. Check out your email to verify account',
        type: auth_entity_1.AuthEntity,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.VERIFY),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email. Enter id user and token' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The user has been successfully verified email.',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Invalid or expired token.',
    }),
    __param(0, (0, common_1.Param)('emailToken')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.LOGIN),
    (0, swagger_1.ApiOperation)({ summary: 'Log in. Only for verified accounts' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'User successfully authorize',
        type: register_entity_1.AuthRegister,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Body)(EmailValidation_pipe_1.EmailValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Login_dto_1.LogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.RESEND_EMAIL),
    (0, swagger_1.ApiOperation)({ summary: 'Action to resend email to receive token' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Email was successfully sent to user.',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiOkResponse)({ type: auth_entity_1.AuthEntity }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Resend_email_dto_1.EmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendEmailValidation", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 60000 } }),
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.RESET_PASSWORD_REQUEST),
    (0, swagger_1.ApiOperation)({
        summary: 'Request for users who wants receive in email to change password',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'On email was sent request to reset password',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiOkResponse)({ type: auth_entity_1.AuthEntity }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)(EmailValidation_pipe_1.EmailValidationPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Resend_email_dto_1.EmailDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestResetPassword", null);
__decorate([
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.RESET_PASSWORD),
    (0, swagger_1.ApiOperation)({
        summary: 'For users, who receive link in email. And know user id.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Password was successfully reset!',
        type: auth_entity_1.AuthEntity,
    }),
    (0, swagger_1.ApiOkResponse)({ type: auth_entity_1.AuthEntity }),
    (0, swagger_1.ApiBody)({
        type: Reset_password_dto_1.ResetPasswordDto,
        description: 'Actions specify new password and user id',
    }),
    __param(0, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('emailToken')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)(site_constants_1.AUTH_ROUTES.LOGOUT),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Log out successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Log out for application ',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.GOOGLE),
    (0, swagger_1.ApiOperation)({
        summary: 'Google log in for application ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to Google OAuth login',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.GOOGLE_CALLBACK),
    (0, swagger_1.ApiOperation)({ summary: 'Callback from Google OAuth' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.GITHUB),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    (0, swagger_1.ApiOperation)({
        summary: 'Github log in for application ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to Github OAuth login',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.GITHUB_CALLBACK),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    (0, swagger_1.ApiOperation)({ summary: 'Callback from Github OAuth' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthCallback", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.DISCORD),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('discord')),
    (0, swagger_1.ApiOperation)({
        summary: 'Discord log in for application ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirects to Discord OAuth login',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "discordAuth", null);
__decorate([
    (0, common_1.Get)(site_constants_1.AUTH_ROUTES.DISCORD_CALLBACK),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('discord')),
    (0, swagger_1.ApiOperation)({ summary: 'Callback from Discord OAuth' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Sets cookie and redirects to frontend',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "discordAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(site_constants_1.AUTH_CONTROLLER),
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.UseInterceptors)(timeout_interceptor_1.TimeoutInterceptor),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        services_1.GoogleService,
        services_1.GithubService,
        services_1.DiscordService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map