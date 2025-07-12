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
exports.GetIdUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("../queries");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const users_repository_1 = require("./../repositories/users.repository");
const user_entity_1 = require("../entities-objectType/user.entity");
const class_transformer_1 = require("class-transformer");
const ttl_1 = require("../../data/ttl");
let GetIdUserHandler = class GetIdUserHandler {
    usersRepository;
    cacheManager;
    constructor(usersRepository, cacheManager) {
        this.usersRepository = usersRepository;
        this.cacheManager = cacheManager;
    }
    async invalidateUserCache(userId) {
        const cacheKey = `users:${userId}`;
        await this.cacheManager.del(cacheKey);
    }
    async execute(query) {
        try {
            const { id } = query;
            const cacheKey = `users:${id}`;
            const cachedUser = await this.cacheManager.get(cacheKey);
            const user = await this.usersRepository.findIdUser(id);
            if (!user) {
                throw new common_1.NotFoundException('No user found');
            }
            if (cachedUser) {
                return (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, cachedUser);
            }
            const userDto = (0, class_transformer_1.plainToInstance)(user_entity_1.UserEntity, user);
            await this.cacheManager.set(cacheKey, userDto, ttl_1.CACHE_TTL.THREE_HOUR);
            return user;
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.GetIdUserHandler = GetIdUserHandler;
exports.GetIdUserHandler = GetIdUserHandler = __decorate([
    (0, cqrs_1.QueryHandler)(queries_1.GetIdUserQuery),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        cache_manager_1.Cache])
], GetIdUserHandler);
//# sourceMappingURL=GetIdUser.handler.js.map