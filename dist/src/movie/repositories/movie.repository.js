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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRepository = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const defaultData_1 = require("../../data/defaultData");
let MovieRepository = class MovieRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMovie(authorId, createMovieDto) {
        return this.prisma.movie.create({
            data: {
                ...createMovieDto,
                author: {
                    connect: { id: authorId },
                },
            },
        });
    }
    async findUniqueMovie(criteria) {
        const { id, title } = criteria;
        const movie = await this.prisma.movie.findUnique({
            where: {
                ...(id && { id }),
                ...(title && { title }),
            },
        });
        return movie;
    }
    async findAuthorMovie(id) {
        const movie = await this.prisma.movie.findMany({
            where: {
                authorId: id,
            },
        });
        return movie;
    }
    async findMovieUniqueWithAuthor(userId, movieId) {
        const favorite = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: {
                    userId: userId,
                    movieId: movieId,
                },
            },
        });
        return !!favorite;
    }
    async addMovieFavWithAuthor(movieId, userId) {
        return this.prisma.userFavoriteMovies.create({
            data: { movieId, userId },
        });
    }
    async findManyInFav(userId, skip, movieId) {
        return await this.prisma.userFavoriteMovies.findMany({
            skip,
            take: defaultData_1.PAGINATION_LIMIT,
            where: {
                userId: userId,
                movieId: movieId,
            },
        });
    }
    async findManyMovieIn(skip, movieIds) {
        return await this.prisma.movie.findMany({
            skip,
            take: defaultData_1.PAGINATION_LIMIT,
            where: {
                id: { in: movieIds },
            },
        });
    }
    async findUniqueFavMov(userId, movieId) {
        return await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
    }
    async removeFromFav(movieId, userId) {
        const favorite = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException(`Movie with ID ${movieId} is not in the favorites of user ${userId}.`);
        }
        return await this.prisma.userFavoriteMovies.delete({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
    }
    async updateMovie(criteria) {
        const { id, updateMovieDto, avg } = criteria;
        return await this.prisma.movie.update({
            where: { id },
            data: {
                ...(updateMovieDto || {}),
                ...(avg !== undefined ? { avgRating: avg } : {}),
            },
        });
    }
    async findAllMovie(skip) {
        return await this.prisma.movie.findMany({
            skip,
            take: defaultData_1.PAGINATION_LIMIT,
            orderBy: {
                id: 'asc',
            },
        });
    }
    async findAllDraftsMovie(skip) {
        return await this.prisma.movie.findMany({
            skip,
            where: { published: false },
            take: defaultData_1.PAGINATION_LIMIT,
            orderBy: {
                id: 'asc',
            },
        });
    }
    async findUniqueRating(movieId, userId) {
        return await this.prisma.rating.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
    }
    async updateRating(id, value) {
        return this.prisma.rating.update({
            where: { id },
            data: { value },
        });
    }
    async createRating(movieId, userId, value) {
        const movieExists = await this.prisma.movie.findUnique({
            where: { id: movieId },
            select: { id: true },
        });
        if (!movieExists) {
            throw new common_1.NotFoundException(`Movie with ID ${movieId} not found.`);
        }
        return this.prisma.rating.create({
            data: {
                value,
                user: { connect: { id: userId } },
                movie: { connect: { id: movieId } },
            },
        });
    }
    async getAllRatingsForMovie(movieId) {
        return this.prisma.rating.findMany({
            where: { movieId },
            select: { value: true },
        });
    }
    async searchMovie(searchText, skip) {
        return await this.prisma.movie.findMany({
            skip,
            take: defaultData_1.PAGINATION_LIMIT,
            where: {
                title: {
                    contains: searchText,
                    mode: 'insensitive',
                },
            },
        });
    }
    async removeMovie(id) {
        const movie = Promise.all([
            this.prisma.reviews.deleteMany({ where: { movieId: id } }),
            this.prisma.rating.deleteMany({ where: { movieId: id } }),
            this.prisma.movie.delete({ where: { id } }),
        ]);
        return movie;
    }
    async filterMovie(filterMovieDto) {
        const { category, minRating, maxRating, orderBy = 'title', order = 'desc', offset = 0, } = filterMovieDto;
        return await this.prisma.movie.findMany({
            where: {
                ...(category
                    ? { category: { contains: category, mode: 'insensitive' } }
                    : {}),
                ...(minRating !== undefined || maxRating !== undefined
                    ? {
                        avgRating: {
                            ...(minRating !== undefined
                                ? { gte: minRating }
                                : {}),
                            ...(maxRating !== undefined
                                ? { lte: maxRating }
                                : {}),
                        },
                    }
                    : {}),
            },
            orderBy: {
                [orderBy]: order,
            },
            skip: offset,
            take: defaultData_1.PAGINATION_LIMIT,
        });
    }
};
exports.MovieRepository = MovieRepository;
exports.MovieRepository = MovieRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MovieRepository);
//# sourceMappingURL=movie.repository.js.map