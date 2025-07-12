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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_entity_1 = require("./entity-objectType/auth.entity");
const cqrs_1 = require("@nestjs/cqrs");
const Login_dto_1 = require("./dto-input/Login.dto");
const commands_1 = require("./commands");
const Auth_repository_1 = require("./repositories/Auth.repository");
const defaultData_1 = require("../data/defaultData");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const Create_user_dto_1 = require("./dto-input/Create-user.dto");
const swagger_1 = require("@nestjs/swagger");
const queries_1 = require("./queries");
const Resend_email_dto_1 = require("./dto-input/Resend-email.dto");
const Reset_password_dto_1 = require("./dto-input/Reset-password.dto");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthResolver = class AuthResolver {
    authRepository;
    commandBus;
    queryBus;
    jwt;
    pubSub;
    constructor(authRepository, commandBus, queryBus, jwt) {
        this.authRepository = authRepository;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.jwt = jwt;
        this.pubSub = new graphql_subscriptions_1.PubSub();
    }
    async login(context, loginInput) {
        const { res } = context;
        const result = await this.commandBus.execute(new commands_1.LoginUserCommand(loginInput));
        if (!result) {
            throw new common_1.BadRequestException('No user found');
        }
        res.cookie('jwtMovie', result.refreshToken, {
            httpOnly: !defaultData_1.isDevelopment,
            sameSite: defaultData_1.isDevelopment ? 'none' : 'strict',
            maxAge: 31 * 24 * 60 * 60 * 1000,
            secure: !defaultData_1.isDevelopment,
        });
        this.pubSub.publish('AUTH_LOGIN_SUBSCRIBE', {
            userLogInSubscribe: result.user,
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
    async userLogInSubscribe() {
        return this.pubSub.asyncIterableIterator('AUTH_LOGIN_SUBSCRIBE');
    }
    async createUser(createUserDto) {
        return await this.commandBus.execute(new commands_1.CreateUserCommand(createUserDto));
    }
    async verifyEmail(token, userId) {
        return await this.queryBus.execute(new queries_1.VerifyEmailQuery(token, userId));
    }
    async resendEmail(userId, emailDto) {
        return new auth_entity_1.AuthEntity(await this.commandBus.execute(new commands_1.ResendEmailCommand(userId, emailDto.email)));
    }
    async requestResetPassword(userId, emailDto, context) {
        const { res } = context;
        return await this.commandBus.execute(new commands_1.ResetPasswordRequestCommand(userId, emailDto.email, res));
    }
    async resetPassword(userId, token, resetPasswordDto) {
        return await this.commandBus.execute(new commands_1.ResetPasswordCommand(userId, token, resetPasswordDto));
    }
    async logout(context) {
        return await this.commandBus.execute(new commands_1.LogoutCommand(context.req, context.res));
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => auth_entity_1.AuthEntity, {
        description: 'Login in',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
        description: 'Authenticate user and return JWT tokens',
    }),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Login_dto_1.LogInDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Subscription)(() => auth_entity_1.AuthEntity, {
        name: 'userLogInSubscribe',
        resolve: (payload) => {
            return payload.userLogInSubscribe;
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "userLogInSubscribe", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_entity_1.AuthEntity, { description: 'Registration user' }),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "createUser", null);
__decorate([
    (0, graphql_1.Query)(() => auth_entity_1.AuthEntity, {
        description: 'Verify email. Enter token user and id',
    }),
    __param(0, (0, graphql_1.Args)('emailToken')),
    __param(1, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyEmail", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_entity_1.AuthEntity, { description: 'Resend Email' }),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Resend_email_dto_1.EmailDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resendEmail", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_entity_1.AuthEntity, {
        description: 'For users, who receive link in email. And know user id.',
    }),
    __param(0, (0, graphql_1.Args)('userId', common_1.ParseIntPipe)),
    __param(1, (0, graphql_1.Args)('email')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Resend_email_dto_1.EmailDto, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "requestResetPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_entity_1.AuthEntity, {
        description: 'For users, who receive link in email. And know user id.',
    }),
    __param(0, (0, graphql_1.Args)('userId', common_1.ParseIntPipe)),
    __param(1, (0, graphql_1.Args)('emailToken', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => String, {
        description: 'Log out for application',
    }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, graphql_1.Resolver)((of) => auth_entity_1.AuthEntity),
    __metadata("design:paramtypes", [Auth_repository_1.AuthRepository,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        jwt_1.JwtService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map