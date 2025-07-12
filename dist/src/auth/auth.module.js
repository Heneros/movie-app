"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("../users/users.module");
const defaultData_1 = require("../data/defaultData");
const mail_service_1 = require("../mail/mail.service");
const auth_resolver_1 = require("./auth.resolver");
const index_1 = require("./handlers/index");
const cache_manager_1 = require("@nestjs/cache-manager");
const cqrs_1 = require("@nestjs/cqrs");
const Auth_repository_1 = require("./repositories/Auth.repository");
const GoogleStrategy_1 = require("./passport/GoogleStrategy");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const services_1 = require("./services");
const config_1 = require("@nestjs/config");
const GithubStrategy_1 = require("./passport/GithubStrategy");
const HandleIOauth_service_1 = require("./services/HandleIOauth.service");
const DiscordStrategy_1 = require("./passport/DiscordStrategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        exports: [AuthModule],
        providers: [
            auth_service_1.AuthService,
            services_1.GoogleService,
            GoogleStrategy_1.GoogleStrategy,
            services_1.GithubService,
            GithubStrategy_1.GithubStrategy,
            cloudinary_service_1.CloudinaryService,
            HandleIOauth_service_1.HandleIOauth,
            services_1.DiscordService,
            DiscordStrategy_1.DiscordStrategy,
            mail_service_1.MailService,
            Auth_repository_1.AuthRepository,
            index_1.LoginUserHandler,
            index_1.CreateUserHandler,
            index_1.VerifyEmailHandler,
            index_1.ResendEmailHandler,
            index_1.ResetPasswordRequestHandler,
            index_1.ResetPasswordHandler,
            index_1.LogoutHandler,
            auth_resolver_1.AuthResolver,
        ],
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            cqrs_1.CqrsModule,
            passport_1.PassportModule,
            cache_manager_1.CacheModule.register(),
            jwt_1.JwtModule.register({
                global: true,
                secret: defaultData_1.jwtConstants.secret,
                signOptions: { expiresIn: '31d' },
            }),
            users_module_1.UsersModule,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map