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
exports.FindDraftsHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const findDrafts_query_1 = require("../queries/findDrafts.query");
const movie_repository_1 = require("../repositories/movie.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const ttl_1 = require("../../data/ttl");
let FindDraftsHandler = class FindDraftsHandler {
    cacheManager;
    movieRepository;
    constructor(cacheManager, movieRepository) {
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(query) {
        const { skip } = query;
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${skip}`;
        const moviesCache = await this.cacheManager.get(cacheKey);
        if (moviesCache) {
            console.log('moviesCache', moviesCache);
            return moviesCache;
        }
        const result = await this.movieRepository.findAllDraftsMovie(skip);
        await this.cacheManager.set(cacheKey, result, ttl_1.CACHE_TTL.ONE_HOUR);
        return result;
    }
};
exports.FindDraftsHandler = FindDraftsHandler;
exports.FindDraftsHandler = FindDraftsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(findDrafts_query_1.FindDraftsMovieQuery),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, movie_repository_1.MovieRepository])
], FindDraftsHandler);
//# sourceMappingURL=findDrafts.handler.js.map