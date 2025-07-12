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
exports.MovieResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const movie_entity_1 = require("./entities-objectType/movie.entity");
const auth_guard_1 = require("../guards/auth.guard");
const ProfileOwner_guard_1 = require("../guards/ProfileOwner.guard");
const defaultData_1 = require("../data/defaultData");
const checkIfMovieExist_guard_1 = require("./guard/checkIfMovieExist.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const movie_input_1 = require("./input/movie.input");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const movie_repository_1 = require("./repositories/movie.repository");
const addMovieFavorite_command_1 = require("./commands/favorite/addMovieFavorite.command");
const getAllFavorite_query_1 = require("./queries/favorite/getAllFavorite.query");
const findDrafts_query_1 = require("./queries/findDrafts.query");
const roles_decorator_1 = require("../decorators/roles.decorator");
const rateMovie_command_1 = require("./commands/rateMovie.command");
const findOneMovie_query_1 = require("./queries/findOneMovie.query");
const removeMovieFavorite_command_1 = require("./commands/favorite/removeMovieFavorite.command");
const findAllMovie_query_1 = require("./queries/findAllMovie.query");
const searchMovie_query_1 = require("./queries/searchMovie.query");
const getAllReviews_query_1 = require("./queries/reviews/getAllReviews.query");
const reviewPaginationEntity_entity_1 = require("./entities-objectType/reviewPaginationEntity.entity");
const getAllReviewsMovie_query_1 = require("./queries/reviews/getAllReviewsMovie.query");
const getSingleReview_query_1 = require("./queries/reviews/getSingleReview.query");
const movieReview_entity_1 = require("./entities-objectType/movieReview.entity");
const createReview_command_1 = require("./commands/reviews/createReview.command");
const create_review_dto_1 = require("./dto-input/create-review.dto");
const updateReview_command_1 = require("./commands/reviews/updateReview.command");
const removeReview_command_1 = require("./commands/reviews/removeReview.command");
const removeMovie_command_1 = require("./commands/removeMovie.command");
const create_movie_dto_1 = require("./dto-input/create-movie.dto");
const createMovie_command_1 = require("./commands/createMovie.command");
const updateMovie_command_1 = require("./commands/updateMovie.command");
let MovieResolver = class MovieResolver {
    movieRepository;
    commandBus;
    queryBus;
    pubSub;
    constructor(movieRepository, commandBus, queryBus) {
        this.movieRepository = movieRepository;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.pubSub = new graphql_subscriptions_1.PubSub();
    }
    async movieRatingUpdated() {
        return this.pubSub.asyncIterableIterator('MOVIE_RATING_UPDATED');
    }
    async createMovie(user, createMovieDto) {
        await this.pubSub.publish('NEW_MESSAGE', {
            newMessage: createMovieDto,
        });
        const userId = user.id;
        const movie = await this.commandBus.execute(new createMovie_command_1.CreateMovieCommand(userId, createMovieDto));
        return new movie_entity_1.MovieEntity(movie);
    }
    async updateMovie(id, updateMovieDto) {
        return await this.commandBus.execute(new updateMovie_command_1.UpdateMovieCommand(id, updateMovieDto));
    }
    async addToFavorite(movieId, user) {
        return new movie_entity_1.MovieEntity(await this.commandBus.execute(new addMovieFavorite_command_1.AddMovieFavCommand(movieId, user.id)));
    }
    async getAllFavorites(userId, pageNum) {
        const page = pageNum ? Number(pageNum) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const favoriteMovies = await this.queryBus.execute(new getAllFavorite_query_1.GetAllFavoritesQuery(userId, skip));
        const movieIds = favoriteMovies.map((fav) => fav.movieId);
        const movies = await this.movieRepository.findManyMovieIn(skip, movieIds);
        return movies.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
    async removeFromFavorite(movieBasicInput) {
        const { movieId, userId } = movieBasicInput;
        if (!movieId || !userId) {
            throw new common_1.NotFoundException(`Problem: movieId (${movieId}) or userId (${userId}) is missing.`);
        }
        const movie = await this.queryBus.execute(new findOneMovie_query_1.FindOneMovieQuery(movieId));
        if (!movie) {
            throw new common_1.NotFoundException(`movie with ${movieId} does not exist.`);
        }
        await this.commandBus.execute(new removeMovieFavorite_command_1.RemoveMovieFavCommand(movieId, userId));
        return new movie_entity_1.MovieEntity(movie);
    }
    async getAllMovies(page) {
        const currentPage = page ?? 1;
        const skip = (currentPage - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new findAllMovie_query_1.FindAllMovieQuery(skip));
        return movies.allMovies.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
    async searchMovies(title, pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new searchMovie_query_1.SearchMovieQuery(title, skip));
        if (!movies || movies.length === 0) {
            throw new common_1.NotFoundException(`Movies with title '${title}' do not exist.`);
        }
        return movies.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
    async findDrafts(pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new findDrafts_query_1.FindDraftsMovieQuery(skip));
        return movies.map((draft) => new movie_entity_1.MovieEntity(draft));
    }
    async findOne(id) {
        const movie = await this.queryBus.execute(new findOneMovie_query_1.FindOneMovieQuery(id));
        return new movie_entity_1.MovieEntity(movie);
    }
    async rateMovie(movieId, value, user) {
        const movie = await this.commandBus.execute(new rateMovie_command_1.RateMovieCommand(movieId, user.id, value));
        this.pubSub.publish('MOVIE_RATING_UPDATED', {
            movieRatingUpdated: movie,
        });
        return movie;
    }
    async getAllReviews(pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const { reviews, total } = await this.queryBus.execute(new getAllReviews_query_1.GetReviewsQuery(skip));
        if (!reviews || reviews.length === 0) {
            throw new common_1.NotFoundException(`Not Exist`);
        }
        return { reviews, total, limit: defaultData_1.PAGINATION_LIMIT };
    }
    async getReviewsByMovie(id, page) {
        const { reviews, total } = await this.queryBus.execute(new getAllReviewsMovie_query_1.GetReviewsByMovieQuery(id, page));
        return { reviews, total, limit: defaultData_1.PAGINATION_LIMIT };
    }
    async getReviewSingleByMovie(id) {
        const review = await this.queryBus.execute(new getSingleReview_query_1.GetSingleReviewQuery(id));
        return review;
    }
    async createReview(movieId, userId, createMovieReviewDto) {
        const newReview = await this.commandBus.execute(new createReview_command_1.CreateReviewCommand(movieId, userId, createMovieReviewDto));
        return newReview;
    }
    async updateReview(reviewId, userId, createMovieReviewDto) {
        const newReview = await this.commandBus.execute(new updateReview_command_1.UpdateReviewCommand(reviewId, userId, createMovieReviewDto));
        return newReview;
    }
    async removeMovie(id) {
        const movie = await this.queryBus.execute(new findOneMovie_query_1.FindOneMovieQuery(id));
        if (!movie) {
            throw new common_1.NotFoundException(`movie with ${id} does not exist.`);
        }
        await this.commandBus.execute(new removeMovie_command_1.RemoveMovieCommand(id));
        return new movie_entity_1.MovieEntity(movie);
    }
    async removeReview(reviewId, userId) {
        const newReview = await this.commandBus.execute(new removeReview_command_1.RemoveReviewCommand(reviewId, userId));
        return newReview;
    }
};
exports.MovieResolver = MovieResolver;
__decorate([
    (0, graphql_1.Subscription)(() => movie_entity_1.MovieEntity, {
        name: 'movieRatingUpdated',
        resolve: (payload) => {
            return payload.movieRatingUpdated;
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "movieRatingUpdated", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => movie_entity_1.MovieEntity, {
        description: 'Create Movie',
    }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_movie_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "createMovie", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => movie_entity_1.MovieEntity, {
        description: 'Update Movie',
    }),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_movie_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "updateMovie", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Mutation)((returns) => movie_entity_1.MovieEntity, {
        description: 'Add to favorite list',
    }),
    __param(0, (0, graphql_1.Args)('movieId', checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __param(1, (0, user_decorator_1.User)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "addToFavorite", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Query)((returns) => [movie_entity_1.MovieEntity], { description: 'Get All favorites ' }),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "getAllFavorites", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Mutation)((returns) => movie_entity_1.MovieEntity, {
        description: 'Remove from favorites',
    }),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_input_1.MovieBasicInput]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "removeFromFavorite", null);
__decorate([
    (0, graphql_1.Query)(() => [movie_entity_1.MovieEntity], { description: 'Get All movies' }),
    __param(0, (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "getAllMovies", null);
__decorate([
    (0, graphql_1.Query)(() => [movie_entity_1.MovieEntity], { description: 'Search movies' }),
    __param(0, (0, graphql_1.Args)('title', { type: () => String })),
    __param(1, (0, graphql_1.Args)('pageString', { type: () => Number, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "searchMovies", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, graphql_1.Query)(() => [movie_entity_1.MovieEntity], { description: 'Get Drafts movies' }),
    __param(0, (0, graphql_1.Args)('page', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "findDrafts", null);
__decorate([
    (0, graphql_1.Query)(() => movie_entity_1.MovieEntity, { description: 'Find By id movie' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number, nullable: false }, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => movie_entity_1.MovieEntity, { description: 'Rate movie' }),
    __param(0, (0, graphql_1.Args)('id', { nullable: false }, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __param(1, (0, graphql_1.Args)('rating', { nullable: false })),
    __param(2, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "rateMovie", null);
__decorate([
    (0, graphql_1.Query)(() => reviewPaginationEntity_entity_1.ReviewPaginationEntity, {
        description: 'Get All Reviews from app',
    }),
    __param(0, (0, graphql_1.Args)('page', { type: () => String, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "getAllReviews", null);
__decorate([
    (0, graphql_1.Query)(() => reviewPaginationEntity_entity_1.ReviewPaginationEntity, {
        description: 'Get All Reviews from movie',
    }),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number, nullable: false })),
    __param(1, (0, graphql_1.Args)('page', { type: () => Number, nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "getReviewsByMovie", null);
__decorate([
    (0, graphql_1.Query)(() => movieReview_entity_1.MovieReviewEntity, {
        description: 'Get single review from movie',
    }),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number, nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "getReviewSingleByMovie", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => movieReview_entity_1.MovieReviewEntity, {
        description: 'Create a review for a movie',
    }),
    __param(0, (0, graphql_1.Args)('movieId', { type: () => Number, nullable: false })),
    __param(1, (0, graphql_1.Args)('userId')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_review_dto_1.CreateMovieReviewDto]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "createReview", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Mutation)(() => movieReview_entity_1.MovieReviewEntity, {
        description: 'Update review movie. You can edit during 15 minutes',
    }),
    __param(0, (0, graphql_1.Args)('reviewId', { type: () => Number, nullable: false })),
    __param(1, (0, graphql_1.Args)('userId')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_review_dto_1.CreateMovieReviewDto]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "updateReview", null);
__decorate([
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => movie_entity_1.MovieEntity, {
        description: '',
    }),
    __param(0, (0, graphql_1.Args)('movieId', {
        type: () => Number,
        nullable: false,
    }, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "removeMovie", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, graphql_1.Mutation)(() => movieReview_entity_1.MovieReviewEntity, {
        description: 'Delete review movie',
    }),
    __param(0, (0, graphql_1.Args)('reviewId', { type: () => Number, nullable: false })),
    __param(1, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "removeReview", null);
exports.MovieResolver = MovieResolver = __decorate([
    (0, graphql_1.Resolver)((of) => movie_entity_1.MovieEntity),
    __metadata("design:paramtypes", [movie_repository_1.MovieRepository,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], MovieResolver);
//# sourceMappingURL=movie.resolver.js.map