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
exports.SearchMovieHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const searchMovie_query_1 = require("../queries/searchMovie.query");
const common_1 = require("@nestjs/common");
const movie_repository_1 = require("../repositories/movie.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
const ttl_1 = require("../../data/ttl");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
let SearchMovieHandler = class SearchMovieHandler {
    movieRepository;
    cacheManager;
    constructor(movieRepository, cacheManager) {
        this.movieRepository = movieRepository;
        this.cacheManager = cacheManager;
    }
    async execute(query) {
        const { searchText, skip } = query;
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:search:${searchText}:${skip}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.movieRepository.searchMovie(searchText, skip);
            if (!result || result.length === 0) {
                throw new common_1.NotFoundException('No matching movies found');
            }
            await this.cacheManager.set(cacheKey, result, ttl_1.CACHE_TTL.ONE_HOUR);
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to search movies');
        }
    }
};
exports.SearchMovieHandler = SearchMovieHandler;
exports.SearchMovieHandler = SearchMovieHandler = __decorate([
    (0, cqrs_1.QueryHandler)(searchMovie_query_1.SearchMovieQuery),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [movie_repository_1.MovieRepository, Object])
], SearchMovieHandler);
//# sourceMappingURL=searchMovie.handler.js.map