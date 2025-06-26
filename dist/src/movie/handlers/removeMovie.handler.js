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
exports.RemoveMovieHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const removeMovie_command_1 = require("../commands/removeMovie.command");
const movie_repository_1 = require("../repositories/movie.repository");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
let RemoveMovieHandler = class RemoveMovieHandler {
    cacheManager;
    movieRepository;
    constructor(cacheManager, movieRepository) {
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { id } = command;
        const movie = await this.movieRepository.removeMovie(id);
        await this.cacheManager.del(`${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${id}`);
        await this.cacheManager.del(`${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${redis_prefix_enum_1.RedisPrefixEnum.MOVIE_LIST}`);
        return movie;
    }
};
exports.RemoveMovieHandler = RemoveMovieHandler;
exports.RemoveMovieHandler = RemoveMovieHandler = __decorate([
    (0, cqrs_1.CommandHandler)(removeMovie_command_1.RemoveMovieCommand),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, movie_repository_1.MovieRepository])
], RemoveMovieHandler);
//# sourceMappingURL=removeMovie.handler.js.map