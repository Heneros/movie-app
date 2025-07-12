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
exports.MovieController = void 0;
const common_1 = require("@nestjs/common");
const create_movie_dto_1 = require("./dto-input/create-movie.dto");
const update_movie_dto_1 = require("./dto-input/update-movie.dto");
const swagger_1 = require("@nestjs/swagger");
const movie_entity_1 = require("./entities-objectType/movie.entity");
const roles_decorator_1 = require("../decorators/roles.decorator");
const defaultData_1 = require("../data/defaultData");
const user_decorator_1 = require("../decorators/user.decorator");
const auth_guard_1 = require("../guards/auth.guard");
const checkIfMovieExist_guard_1 = require("./guard/checkIfMovieExist.guard");
const ProfileOwner_guard_1 = require("../guards/ProfileOwner.guard");
const rate_movie_dto_1 = require("./dto-input/rate-movie.dto");
const cqrs_1 = require("@nestjs/cqrs");
const movie_repository_1 = require("./repositories/movie.repository");
const create_review_dto_1 = require("./dto-input/create-review.dto");
const movieReview_entity_1 = require("./entities-objectType/movieReview.entity");
const redis_service_1 = require("../redis/redis.service");
const gql_throttler_guard_1 = require("../guards/gql-throttler.guard");
const site_constants_1 = require("../sites/site.constants");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const multer_1 = require("multer");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
const filter_movie_dto_1 = require("./dto-input/filter-movie.dto");
let MovieController = class MovieController {
    redisService;
    movieRepository;
    commandBus;
    queryBus;
    cloudinaryService;
    constructor(redisService, movieRepository, commandBus, queryBus, cloudinaryService) {
        this.redisService = redisService;
        this.movieRepository = movieRepository;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.cloudinaryService = cloudinaryService;
    }
    async findAll(pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new queries_1.FindAllMovieQuery(skip));
        return movies.allMovies.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
    async filterMovie(filterMovieDto) {
        const result = await this.commandBus.execute(new commands_1.FilterMoviesCommand(filterMovieDto));
        return result;
    }
    async search(searchText, pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new queries_1.SearchMovieQuery(searchText, skip));
        if (!movies || movies.length === 0) {
            throw new common_1.NotFoundException(`Movies with title '${searchText}' do not exist.`);
        }
        return movies.map((draft) => new movie_entity_1.MovieEntity(draft));
    }
    async getAllReviews(pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        if (page < 1) {
            throw new common_1.BadRequestException('Page must be greater than 0.');
        }
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const { reviews, total } = await this.queryBus.execute(new queries_1.GetReviewsQuery(skip));
        return { reviews, total, page, limit: defaultData_1.PAGINATION_LIMIT };
    }
    async findDrafts(pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(new queries_1.FindDraftsMovieQuery(skip));
        return movies.map((draft) => new movie_entity_1.MovieEntity(draft));
    }
    async findOne(id) {
        const movie = await this.queryBus.execute(new queries_1.FindOneMovieQuery(+id));
        return new movie_entity_1.MovieEntity(movie);
    }
    async create(createMovieDto, user) {
        if (!user || !user.id) {
            throw new Error('User not found or unauthorized');
        }
        const userId = user.id;
        const movie = await this.commandBus.execute(new commands_1.CreateMovieCommand(userId, createMovieDto));
        return new movie_entity_1.MovieEntity(movie);
    }
    async update(id, updateMovieDto) {
        return await this.commandBus.execute(new commands_1.UpdateMovieCommand(id, updateMovieDto));
    }
    async remove(id) {
        const movie = await this.queryBus.execute(new queries_1.FindOneMovieQuery(id));
        if (!movie) {
            throw new common_1.NotFoundException(`movie with ${id} does not exist.`);
        }
        return new movie_entity_1.MovieEntity(await this.commandBus.execute(new commands_1.RemoveMovieCommand(id)));
    }
    async addMovieFav(movieId, user) {
        return new movie_entity_1.MovieEntity(await this.commandBus.execute(new commands_1.AddMovieFavCommand(movieId, user.id)));
    }
    async removeMovieFavorite(userId, movieId) {
        return new movie_entity_1.MovieEntity(await this.commandBus.execute(new commands_1.RemoveMovieFavCommand(movieId, userId)));
    }
    async allFavorites(userId, pageString) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * defaultData_1.PAGINATION_LIMIT;
        const favoriteMovies = await this.queryBus.execute(new queries_1.GetAllFavoritesQuery(userId, skip));
        const movieIds = favoriteMovies.map((fav) => fav.movieId);
        const movies = await this.movieRepository.findManyMovieIn(skip, movieIds);
        return movies.map((movie) => new movie_entity_1.MovieEntity(movie));
    }
    async rateMovie(movieId, user, rateMovieDto) {
        return await this.commandBus.execute(new commands_1.RateMovieCommand(movieId, user.id, rateMovieDto.rating));
    }
    async getReviewsByMovie(id, page = 1) {
        const { reviews, total } = await this.queryBus.execute(new queries_1.GetReviewsByMovieQuery(id, page));
        return { reviews, total, page, limit: defaultData_1.PAGINATION_LIMIT };
    }
    async getSingleReview(id) {
        const review = await this.queryBus.execute(new queries_1.GetSingleReviewQuery(id));
        return review;
    }
    async createReview(movieId, user, createMovieReviewDto) {
        const newReview = await this.commandBus.execute(new commands_1.CreateReviewCommand(movieId, user.id, createMovieReviewDto));
        return newReview;
    }
    async updateReview(reviewId, userId, createMovieReviewDto) {
        const newReview = await this.commandBus.execute(new commands_1.UpdateReviewCommand(reviewId, userId, createMovieReviewDto));
        return newReview;
    }
    async removeReview(reviewId, userId) {
        const newReview = await this.commandBus.execute(new commands_1.RemoveReviewCommand(reviewId, userId));
        return newReview;
    }
    uploadGallery(movieId, files) {
        try {
            if (!files) {
                return 'Error during upload files';
            }
            return this.cloudinaryService.uploadGalleryImages(movieId, files);
        }
        catch (error) {
            console.log('FILES:', error);
        }
    }
};
exports.MovieController = MovieController;
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.GET_ALL),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
    }),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity, isArray: true }),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.FILTER),
    (0, swagger_1.ApiOperation)({ summary: 'Filter movies' }),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_movie_dto_1.FilterMovieDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "filterMovie", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.SEARCH),
    (0, swagger_1.ApiProperty)({ description: 'Search movie by title' }),
    (0, swagger_1.ApiQuery)({
        name: 'title',
        required: true,
        description: 'Search movie by title',
        type: String,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns found movies',
        type: [movie_entity_1.MovieEntity],
    }),
    __param(0, (0, common_1.Query)('title')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.REVIEWS_ALL),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews from site' }),
    (0, swagger_1.ApiOkResponse)({ type: [movieReview_entity_1.MovieReviewEntity] }),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getAllReviews", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.DRAFTS),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity, isArray: true }),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "findDrafts", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.GET_ID_MOVIE),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(site_constants_1.MOVIE_ROUTES.CREATE_MOVIE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiCreatedResponse)({ type: movie_entity_1.MovieEntity }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movie_dto_1.CreateMovieDto, Object]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(site_constants_1.MOVIE_ROUTES.UPDATE_MOVIE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_movie_dto_1.UpdateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(site_constants_1.MOVIE_ROUTES.DELETE_MOVIE),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOkResponse)({ type: movie_entity_1.MovieEntity }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete movie' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The movie has been successfully deleted.',
        type: movie_entity_1.MovieEntity,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(site_constants_1.MOVIE_ROUTES.ADD_FAVORITE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Add to favorite list user.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Add favorite movie to list',
        type: movie_entity_1.MovieEntity,
    }),
    __param(0, (0, common_1.Param)('id', checkIfMovieExist_guard_1.CheckMovieExistPipe, common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "addMovieFav", null);
__decorate([
    (0, common_1.Delete)(site_constants_1.MOVIE_ROUTES.REMOVE_FAVORITE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove from favorite list user.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Remove favorite movie from list',
        type: movie_entity_1.MovieEntity,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('movieId', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "removeMovieFavorite", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.ALL_FAVORITE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'All favorite list user.' }),
    (0, swagger_1.ApiOkResponse)({ type: [movie_entity_1.MovieEntity] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "allFavorites", null);
__decorate([
    (0, common_1.Patch)(site_constants_1.MOVIE_ROUTES.RATE_MOVIE),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Rate Movie' }),
    (0, swagger_1.ApiOkResponse)({ type: [movie_entity_1.MovieEntity] }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __param(1, (0, user_decorator_1.User)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, rate_movie_dto_1.RateMovieDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "rateMovie", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.GET_All_REVIEW_FROM_MOVIE),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews from movie' }),
    (0, swagger_1.ApiOkResponse)({ type: [movie_entity_1.MovieEntity] }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getReviewsByMovie", null);
__decorate([
    (0, common_1.Get)(site_constants_1.MOVIE_ROUTES.GET_SINGLE_REVIEW_FROM_MOVIE),
    (0, swagger_1.ApiOperation)({ summary: 'Get single review from movie' }),
    (0, swagger_1.ApiOkResponse)({ type: [movie_entity_1.MovieEntity] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getSingleReview", null);
__decorate([
    (0, common_1.Post)(site_constants_1.MOVIE_ROUTES.CREATE_REVIEW),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create review movie' }),
    (0, swagger_1.ApiOkResponse)({ type: [movieReview_entity_1.MovieReviewEntity] }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe, checkIfMovieExist_guard_1.CheckMovieExistPipe)),
    __param(1, (0, user_decorator_1.User)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, create_review_dto_1.CreateMovieReviewDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "createReview", null);
__decorate([
    (0, common_1.Put)(site_constants_1.MOVIE_ROUTES.UPDATE_REVIEW),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, ProfileOwner_guard_1.ProfileOwnerGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Update review movie. You can edit during 15 minutes',
    }),
    (0, swagger_1.ApiOkResponse)({ type: [movieReview_entity_1.MovieReviewEntity] }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_review_dto_1.CreateMovieReviewDto]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)(site_constants_1.MOVIE_ROUTES.DELETE_REVIEW),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete review movie' }),
    (0, swagger_1.ApiOkResponse)({ type: [movieReview_entity_1.MovieReviewEntity] }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "removeReview", null);
__decorate([
    (0, common_1.Post)(site_constants_1.MOVIE_ROUTES.UPLOAD_IMAGES),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Editor'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "uploadGallery", null);
exports.MovieController = MovieController = __decorate([
    (0, common_1.Controller)(site_constants_1.MOVIE_CONTROLLER),
    (0, swagger_1.ApiTags)('Movie'),
    (0, common_1.UseGuards)(gql_throttler_guard_1.GqlThrottlerGuard),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        movie_repository_1.MovieRepository,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        cloudinary_service_1.CloudinaryService])
], MovieController);
//# sourceMappingURL=movie.controller.js.map