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
exports.FindAllMovieHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const findAllMovie_query_1 = require("../queries/findAllMovie.query");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const movie_repository_1 = require("./../repositories/movie.repository");
const ttl_1 = require("../../data/ttl");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
let FindAllMovieHandler = class FindAllMovieHandler {
    movieRepository;
    cacheManager;
    constructor(movieRepository, cacheManager) {
        this.movieRepository = movieRepository;
        this.cacheManager = cacheManager;
    }
    async execute(query) {
        const { skip } = query;
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${skip}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        const start = Date.now();
        if (cachedData) {
            return { allMovies: cachedData };
        }
        const allMovies = await this.movieRepository.findAllMovie(skip);
        if (allMovies.length === 0) {
            throw new common_1.NotFoundException('No movies Exist');
        }
        await this.cacheManager.set(cacheKey, allMovies, ttl_1.CACHE_TTL.ONE_MINUTE);
        return { allMovies };
    }
};
exports.FindAllMovieHandler = FindAllMovieHandler;
exports.FindAllMovieHandler = FindAllMovieHandler = __decorate([
    (0, cqrs_1.QueryHandler)(findAllMovie_query_1.FindAllMovieQuery),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [movie_repository_1.MovieRepository, Object])
], FindAllMovieHandler);
//# sourceMappingURL=findAllMovie.handler.js.map