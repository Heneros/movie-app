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
exports.UpdateMovieHandler = void 0;
const updateMovie_command_1 = require("../commands/updateMovie.command");
const movie_repository_1 = require("../repositories/movie.repository");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const cache_manager_1 = require("@nestjs/cache-manager");
const ttl_1 = require("../../data/ttl");
let UpdateMovieHandler = class UpdateMovieHandler {
    cacheManager;
    movieRepository;
    constructor(cacheManager, movieRepository) {
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { id, updateMovieDto } = command;
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${id}`;
        try {
            await this.cacheManager.del(cacheKey);
            const movie = await this.movieRepository.updateMovie({
                id,
                updateMovieDto,
            });
            await this.cacheManager.set(cacheKey, movie.id, ttl_1.CACHE_TTL.ONE_DAY);
            return movie;
        }
        catch (error) {
            console.error('Error updating movie:', error);
            throw new common_1.BadRequestException('Invalid data format');
        }
    }
};
exports.UpdateMovieHandler = UpdateMovieHandler;
exports.UpdateMovieHandler = UpdateMovieHandler = __decorate([
    (0, cqrs_1.CommandHandler)(updateMovie_command_1.UpdateMovieCommand),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, movie_repository_1.MovieRepository])
], UpdateMovieHandler);
//# sourceMappingURL=updateMovie.handler.js.map