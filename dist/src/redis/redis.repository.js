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
exports.RedisRepository = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("@upstash/redis");
let RedisRepository = class RedisRepository {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    generateKey(prefix, key) {
        return `${prefix}:${key}`;
    }
    async get(prefix, key) {
        const fullKey = this.generateKey(prefix, key);
        return await this.redis.get(fullKey);
    }
    async set(prefix, key, value) {
        await this.redis.set(`${prefix}:${key}`, value);
    }
    async delete(prefix, key) {
        await this.redis.del(`${prefix}:${key}`);
    }
    async flushAll() {
        await this.redis.flushdb();
    }
    async setWithExpiry(prefix, key, value, ttl) {
        const fullKey = this.generateKey(prefix, key);
        await this.redis.set(fullKey, value, { ex: ttl });
    }
};
exports.RedisRepository = RedisRepository;
exports.RedisRepository = RedisRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RedisClient')),
    __metadata("design:paramtypes", [redis_1.Redis])
], RedisRepository);
//# sourceMappingURL=redis.repository.js.map