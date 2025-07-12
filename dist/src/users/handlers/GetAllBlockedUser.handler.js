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
exports.GetAllBlockedUsersHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("../queries");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const users_repository_1 = require("./../repositories/users.repository");
const ttl_1 = require("../../data/ttl");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const nest_winston_1 = require("nest-winston");
let GetAllBlockedUsersHandler = class GetAllBlockedUsersHandler {
    logger;
    usersRepository;
    cacheManager;
    constructor(logger, usersRepository, cacheManager) {
        this.logger = logger;
        this.usersRepository = usersRepository;
        this.cacheManager = cacheManager;
    }
    async execute(query) {
        const { page } = query;
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.USERS}:blocked:${page}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const allUsers = await this.usersRepository.findAllBlockedUsers(page);
        if (allUsers.length === 0) {
            this.logger.warn(`No blocked users found on page ${page}`);
            throw new common_1.NotFoundException('No blocked users found');
        }
        await this.cacheManager.set(cacheKey, allUsers, ttl_1.CACHE_TTL.HALF_HOUR);
        return allUsers;
    }
};
exports.GetAllBlockedUsersHandler = GetAllBlockedUsersHandler;
exports.GetAllBlockedUsersHandler = GetAllBlockedUsersHandler = __decorate([
    (0, cqrs_1.QueryHandler)(queries_1.GetAllBlockedUsersQuery),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, users_repository_1.UsersRepository,
        cache_manager_1.Cache])
], GetAllBlockedUsersHandler);
//# sourceMappingURL=GetAllBlockedUser.handler.js.map