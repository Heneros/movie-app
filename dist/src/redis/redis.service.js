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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("@upstash/redis");
const redis_prefix_enum_1 = require("../data/redis-prefix-enum");
const ttl_1 = require("../data/ttl");
let RedisService = class RedisService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    makeKey(prefix, page) {
        return `${prefix}:${page}`;
    }
    async saveMovies(page, data) {
        const key = this.makeKey(redis_prefix_enum_1.RedisPrefixEnum.MOVIE_LIST, page);
        const value = JSON.stringify(data);
        console.log(value);
        const res = await this.redis.set(key, value, {
            ex: ttl_1.CACHE_TTL.ONE_HOUR,
        });
        console.log(res);
    }
    async deleteMovies(page) {
        const key = this.makeKey(redis_prefix_enum_1.RedisPrefixEnum.MOVIE_LIST, page);
        await this.redis.del(key);
    }
    async getMovies(page) {
        const key = this.makeKey(redis_prefix_enum_1.RedisPrefixEnum.MOVIE_LIST, page);
        const result = await this.redis.get(key);
        if (result) {
            return result;
        }
        return null;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RedisClient')),
    __metadata("design:paramtypes", [redis_1.Redis])
], RedisService);
//# sourceMappingURL=redis.service.js.map