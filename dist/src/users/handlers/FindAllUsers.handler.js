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
exports.FindAllUsersHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const queries_1 = require("../queries");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const users_repository_1 = require("./../repositories/users.repository");
const ttl_1 = require("../../data/ttl");
let FindAllUsersHandler = class FindAllUsersHandler {
    usersRepository;
    cacheManager;
    constructor(usersRepository, cacheManager) {
        this.usersRepository = usersRepository;
        this.cacheManager = cacheManager;
    }
    async execute(query) {
        const { page } = query;
        const cacheKey = `users:${page}`;
        const cached = await this.cacheManager.get(cacheKey);
        const start = Date.now();
        if (cached) {
            const end = Date.now();
            console.log(`Cache HIT for page ${page}, took ${end - start}ms`);
            return cached;
        }
        const allUsers = await this.usersRepository.findAllUsers(page);
        if (allUsers.length === 0) {
            throw new common_1.NotFoundException('No users exist');
        }
        const end = Date.now();
        console.log(`Cache MISS for page 444 ${page}, took ${end - start}ms`);
        await this.cacheManager.set(cacheKey, allUsers, ttl_1.CACHE_TTL.HALF_HOUR);
        return allUsers;
    }
};
exports.FindAllUsersHandler = FindAllUsersHandler;
exports.FindAllUsersHandler = FindAllUsersHandler = __decorate([
    (0, cqrs_1.QueryHandler)(queries_1.FindAllUsersQuery),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        cache_manager_1.Cache])
], FindAllUsersHandler);
//# sourceMappingURL=FindAllUsers.handler.js.map