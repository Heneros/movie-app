"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const mail_module_1 = require("../mail/mail.module");
const users_repository_1 = require("./repositories/users.repository");
const handlers_1 = require("./handlers");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const users_resolver_1 = require("./users.resolver");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const cache_manager_1 = require("@nestjs/cache-manager");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            users_repository_1.UsersRepository,
            handlers_1.FindAllUsersHandler,
            handlers_1.GetIdUserHandler,
            handlers_1.UpdateUserHandler,
            handlers_1.DeleteUserHandler,
            handlers_1.DeleteMyAccountHandler,
            handlers_1.ChangeRoleHandler,
            handlers_1.BanUserAccountHandler,
            handlers_1.GetAllBlockedUsersHandler,
            users_resolver_1.UsersResolver,
            {
                provide: 'PUB_SUB',
                useValue: new graphql_subscriptions_1.PubSub(),
            },
        ],
        imports: [
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            cloudinary_module_1.CloudinaryModule,
            cache_manager_1.CacheModule.register(),
        ],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map