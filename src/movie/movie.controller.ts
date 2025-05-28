import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    NotFoundException,
    Query,
    UseGuards,
    BadRequestException,
    Put,
    DefaultValuePipe,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    ValidationPipe,
} from '@nestjs/common';
import { CreateMovieDto } from './dto-input/create-movie.dto';
import { UpdateMovieDto } from './dto-input/update-movie.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { MovieEntity } from './entities-objectType/movie.entity';
import { Roles } from '@/decorators/roles.decorator';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { User } from '@/decorators/user.decorator';
import { Movie } from '@prisma/client';

import { AuthGuard } from '@/guards/auth.guard';

import { CheckMovieExistPipe } from './guard/checkIfMovieExist.guard';
import { ProfileOwnerGuard } from '@/guards/ProfileOwner.guard';
import { RateMovieDto } from './dto-input/rate-movie.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieReviewDto } from './dto-input/create-review.dto';
import { MovieReviewEntity } from './entities-objectType/movieReview.entity';
import { RedisService } from '../redis/redis.service';

import { GqlThrottlerGuard } from '../guards/gql-throttler.guard';
import { MOVIE_CONTROLLER, MOVIE_ROUTES } from '@/sites/site.constants';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { memoryStorage } from 'multer';
import {
    AddMovieFavCommand,
    CreateMovieCommand,
    CreateReviewCommand,
    FilterMoviesCommand,
    RateMovieCommand,
    RemoveMovieCommand,
    RemoveMovieFavCommand,
    RemoveReviewCommand,
    UpdateMovieCommand,
    UpdateReviewCommand,
} from './commands';
import {
    FindAllMovieQuery,
    FindDraftsMovieQuery,
    FindOneMovieQuery,
    GetAllFavoritesQuery,
    GetReviewsByMovieQuery,
    GetReviewsQuery,
    GetSingleReviewQuery,
    SearchMovieQuery,
} from './queries';
import { FilterMovieDto } from './dto-input/filter-movie.dto';

@Controller(MOVIE_CONTROLLER)
@ApiTags('Movie')
// @UseInterceptors(CacheInterceptor)
@UseGuards(GqlThrottlerGuard)
// @UseInterceptors(TimeoutInterceptor)
export class MovieController {
    constructor(
        private readonly redisService: RedisService,
        private readonly movieRepository: MovieRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    @Get(MOVIE_ROUTES.GET_ALL)
    // @CacheTTL(60)
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
    })
    @ApiOkResponse({ type: MovieEntity, isArray: true })
    async findAll(@Query('page') pageString?: string) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const movies = await this.queryBus.execute(new FindAllMovieQuery(skip));

        return movies.allMovies.map((movie: Movie) => new MovieEntity(movie));
    }

    @Get(MOVIE_ROUTES.FILTER)
    @ApiOperation({ summary: 'Filter movies' })
    @ApiOkResponse({ type: MovieEntity })
    async filterMovie(
        @Query(new ValidationPipe({ transform: true }))
        filterMovieDto: FilterMovieDto,
    ): Promise<MovieEntity[]> {
        const result = await this.commandBus.execute(
            new FilterMoviesCommand(filterMovieDto),
        );
        return result;
    }

    @Get(MOVIE_ROUTES.SEARCH)
    // @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ApiProperty({ description: 'Search movie by title' })
    @ApiQuery({
        name: 'title',
        required: true,
        description: 'Search movie by title',
        type: String,
    })
    @ApiOkResponse({
        description: 'Returns found movies',
        type: [MovieEntity],
    })
    async search(
        @Query('title') searchText: string,
        @Query('page') pageString?: string,
    ): Promise<MovieEntity[]> {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const movies = await this.queryBus.execute(
            new SearchMovieQuery(searchText, skip),
        );

        if (!movies || movies.length === 0) {
            throw new NotFoundException(
                `Movies with title '${searchText}' do not exist.`,
            );
        }

        return movies.map((draft: Movie) => new MovieEntity(draft));
        // return movies.map((movie) => new MovieEntity(movie));
    }

    @Get(MOVIE_ROUTES.REVIEWS_ALL)
    @ApiOperation({ summary: 'Get all reviews from site' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    async getAllReviews(@Query('page') pageString?: string) {
        // const nameNum = Number(page);
        const page = pageString ? parseInt(pageString, 10) : 1;

        if (isNaN(page)) {
            throw new BadRequestException('Page must be a number.');
        }
        if (page < 1) {
            throw new BadRequestException('Page must be greater than 0.');
        }

        const skip = (page - 1) * PAGINATION_LIMIT;
        const { reviews, total } = await this.queryBus.execute(
            new GetReviewsQuery(skip),
        );
        return { reviews, total, page, limit: PAGINATION_LIMIT };
    }

    @Get(MOVIE_ROUTES.DRAFTS)
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity, isArray: true })
    async findDrafts(@Query('page') pageString?: string) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;
        const movies = await this.queryBus.execute(
            new FindDraftsMovieQuery(skip),
        );

        return movies.map((draft) => new MovieEntity(draft));
    }

    @Get(MOVIE_ROUTES.GET_ID_MOVIE)
    // @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ApiOkResponse({ type: MovieEntity })
    async findOne(@Param('id', ParseIntPipe, CheckMovieExistPipe) id: number) {
        const movie = await this.queryBus.execute(new FindOneMovieQuery(+id));

        return new MovieEntity(movie);
    }

    @Post(MOVIE_ROUTES.CREATE_MOVIE)
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiCreatedResponse({ type: MovieEntity })
    @ApiBearerAuth('access-token')
    async create(@Body() createMovieDto: CreateMovieDto, @User() user: User) {
        if (!user || !user.id) {
            throw new Error('User not found or unauthorized');
        }
        // createMovieDto.authorId = user.id;
        const userId = user.id;
        const movie = await this.commandBus.execute(
            new CreateMovieCommand(userId, createMovieDto),
        );
        return new MovieEntity(movie);
    }

    @Patch(MOVIE_ROUTES.UPDATE_MOVIE)
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMovieDto: UpdateMovieDto,
    ) {
        return await this.commandBus.execute(
            new UpdateMovieCommand(id, updateMovieDto),
        );
    }

    @Delete(MOVIE_ROUTES.DELETE_MOVIE)
    @Roles('Admin', 'Editor')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity })
    @ApiOperation({ summary: 'Delete movie' })
    @ApiCreatedResponse({
        description: 'The movie has been successfully deleted.',
        type: MovieEntity,
    })
    async remove(@Param('id', ParseIntPipe, CheckMovieExistPipe) id: number) {
        const movie = await this.queryBus.execute(new FindOneMovieQuery(id));
        if (!movie) {
            throw new NotFoundException(`movie with ${id} does not exist.`);
        }
        return new MovieEntity(
            await this.commandBus.execute(new RemoveMovieCommand(id)),
        );
        // return new MovieEntity(await this.movieRemoveService.remove(id));
    }

    @Post(MOVIE_ROUTES.ADD_FAVORITE)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Add to favorite list user.' })
    @ApiOkResponse({
        description: 'Add favorite movie to list',
        type: MovieEntity,
    })
    async addMovieFav(
        @Param('id', CheckMovieExistPipe, ParseIntPipe) movieId: number,
        @User('userId') user: User,
    ) {
        return new MovieEntity(
            await this.commandBus.execute(
                new AddMovieFavCommand(movieId, user.id),
            ),
        );
    }

    @Delete(MOVIE_ROUTES.REMOVE_FAVORITE)
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({ summary: 'Remove from favorite list user.' })
    @ApiOkResponse({
        description: 'Remove favorite movie from list',
        type: MovieEntity,
    })
    @ApiBearerAuth('access-token')
    async removeMovieFavorite(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('movieId', ParseIntPipe, CheckMovieExistPipe) movieId: number,
        // @Body('movieId', ParseIntPipe, CheckMovieExistPipe) movieId: number,
    ): Promise<MovieEntity> {
        return new MovieEntity(
            await this.commandBus.execute(
                new RemoveMovieFavCommand(movieId, userId),
            ),
        );
    }

    @Get(MOVIE_ROUTES.ALL_FAVORITE)
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'All favorite list user.' })
    @ApiOkResponse({ type: [MovieEntity] })
    async allFavorites(
        @User('userId') user: User,
        @Query('page') pageString?: string,
    ): Promise<MovieEntity[]> {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const userId = user.id;
        const favoriteMovies = await this.queryBus.execute(
            new GetAllFavoritesQuery(userId, skip),
        );

        const movieIds = favoriteMovies.map((fav) => fav.movieId);

        const movies = await this.movieRepository.findManyMovieIn(
            skip,
            movieIds,
        );

        return movies.map((movie) => new MovieEntity(movie));
    }

    @Patch(MOVIE_ROUTES.RATE_MOVIE)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Rate Movie' })
    @ApiOkResponse({ type: [MovieEntity] })
    @ApiBearerAuth('access-token')
    async rateMovie(
        @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
        @User('id') user: User,
        @Body() rateMovieDto: RateMovieDto,
    ): Promise<Movie> {
        return await this.commandBus.execute(
            new RateMovieCommand(movieId, user.id, rateMovieDto.rating),
        );
    }

    @Get(MOVIE_ROUTES.GET_All_REVIEW_FROM_MOVIE)
    @ApiOperation({ summary: 'Get all reviews from movie' })
    @ApiOkResponse({ type: [MovieEntity] })
    @ApiBearerAuth('access-token')
    async getReviewsByMovie(
        @Param('id', ParseIntPipe, CheckMovieExistPipe) id: number,
        @Query('page') page: number = 1,
    ) {
        const { reviews, total } = await this.queryBus.execute(
            new GetReviewsByMovieQuery(id, page),
        );
        return { reviews, total, page, limit: PAGINATION_LIMIT };
    }

    @Get(MOVIE_ROUTES.GET_SINGLE_REVIEW_FROM_MOVIE)
    @ApiOperation({ summary: 'Get single review from movie' })
    @ApiOkResponse({ type: [MovieEntity] })
    async getSingleReview(@Param('id', ParseIntPipe) id: number) {
        const review = await this.queryBus.execute(
            new GetSingleReviewQuery(id),
        );
        return review;
    }

    @Post(MOVIE_ROUTES.CREATE_REVIEW)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create review movie' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    @ApiBearerAuth('access-token')
    async createReview(
        @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
        @User('id') user: User,
        @Body() createMovieReviewDto: CreateMovieReviewDto,
    ): Promise<CreateMovieReviewDto | void> {
        const newReview = await this.commandBus.execute(
            new CreateReviewCommand(movieId, user.id, createMovieReviewDto),
        );
        return newReview;
    }

    @Put(MOVIE_ROUTES.UPDATE_REVIEW)
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({
        summary: 'Update review movie. You can edit during 15 minutes',
    })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    @ApiBearerAuth('access-token')
    async updateReview(
        @Param('id', ParseIntPipe) reviewId: number,
        @User('id') user: User,
        @Body() createMovieReviewDto: CreateMovieReviewDto,
    ): Promise<CreateMovieReviewDto | null> {
        const newReview = await this.commandBus.execute(
            new UpdateReviewCommand(reviewId, user.id, createMovieReviewDto),
        );
        return newReview;
    }

    @Delete(MOVIE_ROUTES.DELETE_REVIEW)
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiOperation({ summary: 'Delete review movie' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    @ApiBearerAuth('access-token')
    async removeReview(
        @Param('id', ParseIntPipe) reviewId: number,
        @User('id') user: User,
    ): Promise<CreateMovieReviewDto | null> {
        const newReview = await this.commandBus.execute(
            new RemoveReviewCommand(reviewId, user.id),
        );
        return newReview;
    }

    @Post(MOVIE_ROUTES.UPLOAD_IMAGES)
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    uploadGallery(
        @Param('id', ParseIntPipe) movieId: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        try {
            if (!files) {
                return 'Error during upload files';
            }
            return this.cloudinaryService.uploadGalleryImages(movieId, files);
        } catch (error) {
            console.log('FILES:', error);
        }
    }
}
