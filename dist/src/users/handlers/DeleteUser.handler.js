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
exports.DeleteUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./../repositories/users.repository");
const commands_1 = require("../commands");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const nest_winston_1 = require("nest-winston");
let DeleteUserHandler = class DeleteUserHandler {
    logger;
    cacheManager;
    usersRepository;
    constructor(logger, cacheManager, usersRepository) {
        this.logger = logger;
        this.cacheManager = cacheManager;
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        const { id } = command;
        try {
            const userIsAdmin = await this.usersRepository.findIdUser(+id);
            if (!userIsAdmin) {
                return new common_1.NotFoundException('No user found');
            }
            if (userIsAdmin?.roles?.includes('Admin')) {
                return new common_1.ForbiddenException('Admin cannot delete their own account');
            }
            await this.usersRepository.deleteUserAccount(id);
            await this.cacheManager.del(`${redis_prefix_enum_1.RedisPrefixEnum.USERS}:${id}`);
            return `User was deleted ${userIsAdmin.name}`;
        }
        catch (error) {
            this.logger.error('Delete User', error);
        }
    }
};
exports.DeleteUserHandler = DeleteUserHandler;
exports.DeleteUserHandler = DeleteUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.DeleteUserCommand),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, users_repository_1.UsersRepository])
], DeleteUserHandler);
//# sourceMappingURL=DeleteUser.handler.js.map