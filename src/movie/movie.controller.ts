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
    ValidationPipe,
    UseInterceptors,
    UseGuards,
    BadRequestException,
    InternalServerErrorException,
    Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Roles } from '@/decorators/roles.decorator';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { User } from '@/decorators/user.decorator';
import { Public } from '@/decorators/public.decorator';
import { SearchMovieDto } from './dto/search-movie.dto';
import { TimeoutInterceptor } from '@/interceptor/timeout.interceptor';
import { Movie } from '@prisma/client';
import { MovieFavorite } from './services/addMovieFavoriteList.service';
import { AuthGuard } from '@/guards/auth.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { MovieSearchService } from './services/searchMovie.service';
import { MovieCreateService } from './services/createMovie.service';
import { MovieFindAllService } from './services/findAllMovie.service';
import { MovieFindOneService } from './services/findOneMovie.service';
import { MovieUpdateService } from './services/updateMovie.service';
import { MovieRemoveService } from './services/removeMovie.service';
import { MovieFindDraftsService } from './services/findDraftsMovie.service';
import { MovieRateService } from './services/rateMovie.service';
import { CheckMovieExistPipe } from './guard/checkIfMovieExist.guard';
import { ProfileOwnerGuard } from '@/guards/ProfileOwner.guard';
import { RateMovieDto } from './dto/rate-movie.dto';
import { MovieCreateReviewService } from './services/reviews/createReview.service';
import { CreateMovieReviewDto } from './dto/create-review.dto';
import { MovieGetReviewsByMovieService } from './services/reviews/getReviewsByMovie.service';
import { MovieReviewEntity } from './entities/movieReview.entity';
import { MovieGetAllReviewService } from './services/reviews/getAllReviews.service';
import { MovieUpdateReviewService } from './services/reviews/updatereview.service';
import { MovieRemoveReviewService } from './services/reviews/removeByIdReview.service';

@Controller('movie')
@ApiTags('Movie')
@UseInterceptors(TimeoutInterceptor)
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly movieFavorite: MovieFavorite,
        private readonly movieSearchService: MovieSearchService,
        private readonly movieCreateService: MovieCreateService,
        private readonly movieFindAllService: MovieFindAllService,
        private readonly movieFindOneService: MovieFindOneService,
        private readonly movieUpdateService: MovieUpdateService,
        private readonly movieRemoveService: MovieRemoveService,
        private readonly movieFindDraftsService: MovieFindDraftsService,
        private readonly movieRateService: MovieRateService,
        private readonly movieCreateReviewService: MovieCreateReviewService,
        private readonly movieGetReviewsByMovieService: MovieGetReviewsByMovieService,
        private readonly movieGetAllReviewService: MovieGetAllReviewService,
        private readonly movieUpdateReviewService: MovieUpdateReviewService,
        private readonly movieRemoveReviewService: MovieRemoveReviewService,

        private readonly prisma: PrismaService,
    ) {}

    @Get()
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

        const movies = (await this.movieFindAllService.findAll(
            skip,
        )) as Movie[];

        return movies.map((movie) => new MovieEntity(movie));
    }

    @Get('search')
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
        @Query('title')
        searchText: string,
        @Query('page') pageString?: string,
    ): Promise<MovieEntity[]> {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const movies = (await this.movieSearchService.searchByTitle(
            searchText,
            skip,
        )) as Movie[];

        if (!movies || movies.length === 0) {
            throw new NotFoundException(
                `Movies with title '${searchText}' do not exist.`,
            );
        }

        return movies.map((movie) => new MovieEntity(movie));
    }

    @Get('drafts')
    @Roles('Admin', 'Editor')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity, isArray: true })
    async findDrafts(@Query('page') pageString?: string) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const drafts = (await this.movieFindDraftsService.findDrafts(
            skip,
        )) as Movie[];

        return drafts.map((draft) => new MovieEntity(draft));
    }

    // @Public()

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: MovieEntity })
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    async create(@Body() createMovieDto: CreateMovieDto, @User() user: User) {
        if (!user || !user.id) {
            throw new Error('User not found or unauthorized');
        }
        createMovieDto.authorId = user.id;

        return new MovieEntity(
            await this.movieCreateService.create(createMovieDto),
        );
    }
    @Get('allReviews')
    @Roles('Admin', 'Editor')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create review movie' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    async getAllReviews(
        @Query('page') page: number = 1,
    ): Promise<MovieReviewEntity[] | null> {
        // console.log('test12');
        return await this.movieGetAllReviewService.getAllReviews(page);
    }

    @Get(':id')
    @ApiOkResponse({ type: MovieEntity })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const movie = await this.movieFindOneService.findOne(+id);
        if (!movie) {
            throw new NotFoundException(`movie with ${id} does not exist.`);
        }
        return new MovieEntity(movie);
    }
    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMovieDto: UpdateMovieDto,
    ) {
        return new MovieEntity(
            await this.movieUpdateService.update(id, updateMovieDto),
        );
    }

    @Delete(':id')
    @Roles('Admin', 'Editor')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const movie = await this.movieFindOneService.findOne(id);

        if (!movie) {
            throw new NotFoundException(`movie with ${id} does not exist.`);
        }
        return new MovieEntity(await this.movieRemoveService.remove(id));
    }

    @Post(':id/addFav')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Add to favorite list user.' })
    @ApiOkResponse({ type: MovieEntity })
    async addMovieFav(
        @Param('id', CheckMovieExistPipe, ParseIntPipe) movieId: number,
        @Body('userId') userId: number,
    ) {
        return new MovieEntity(
            await this.movieFavorite.addMovieFav(movieId, userId),
        );
    }

    @Delete(':id/removeFav')
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({ summary: 'Add to favorite list user.' })
    @ApiOkResponse({ type: MovieEntity })
    @ApiBearerAuth('access-token')
    async removeMovieFavorite(
        @Param('id', ParseIntPipe) movieId: number,
        @Body('userId') userObjectId: number,
    ) {
        const movie = await this.movieFindOneService.findOne(movieId);

        if (!movie) {
            throw new NotFoundException(
                `movie with ${movieId} does not exist.`,
            );
        }

        const userId = userObjectId;
        return new MovieEntity(
            await this.movieFavorite.removeMovieFav(movieId, userId),
        );
    }

    @Get(':id/allFavorites')
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'All favorite list user.' })
    @ApiOkResponse({ type: [MovieEntity] })
    async allFavorites(
        @User('id') user: User,
        @Query('page') pageString?: string,
    ): Promise<MovieEntity[]> {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;
        const favoriteMovies = await this.movieFavorite.getAllFavorites(
            user.id,
        );

        // console.log('allFavorites', user);
        const movieIds = favoriteMovies.map((fav) => fav.movieId);

        const movies = await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: {
                id: { in: movieIds },
            },
        });

        return movies.map((movie) => new MovieEntity(movie));
    }

    @Patch(':id/rateMovie')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Rate Movie' })
    @ApiOkResponse({ type: [MovieEntity] })
    @ApiBearerAuth('access-token')
    async rateMovie(
        @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
        @User('id') user: User,
        @Body() rateMovieDto: RateMovieDto,
    ): Promise<Movie> {
        // console.log(rateMovieDto);

        return await this.movieRateService.rateMovie(
            movieId,
            user.id,
            rateMovieDto.rating,
        );
    }

    @Get(':id/review')
    @ApiOperation({ summary: 'Get all reviews from movie' })
    @ApiOkResponse({ type: [MovieEntity] })
    @ApiBearerAuth('access-token')
    async getReviewsByMovie(
        @Query('page') page: number = 1,
        @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
    ) {
        // console.log(rateMovieDto);

        return await this.movieGetReviewsByMovieService.getReviewsByMovie(
            page,
            movieId,
        );
    }

    @Post(':id/review')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create review movie' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    @ApiBearerAuth('access-token')
    async createReview(
        @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
        @User('id') user: User,
        @Body() createMovieReviewDto: CreateMovieReviewDto,
    ): Promise<CreateMovieReviewDto | void> {
        const newReview = await this.movieCreateReviewService.createReview(
            movieId,
            user.id,
            createMovieReviewDto,
        );
        return newReview;
    }

    @Put(':id/review')
    @UseGuards(AuthGuard)
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
        const newReview = await this.movieUpdateReviewService.updateReviewMovie(
            reviewId,
            user.id,
            createMovieReviewDto,
        );
        return newReview;
    }

    @Delete(':id/review')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete review movie' })
    @ApiOkResponse({ type: [MovieReviewEntity] })
    @ApiBearerAuth('access-token')
    async removeReview(
        @Param('id', ParseIntPipe) reviewId: number,
        @User('id') user: User,
    ): Promise<CreateMovieReviewDto | null> {
        const newReview = await this.movieRemoveReviewService.removeReviewMovie(
            reviewId,
            user.id,
        );
        return newReview;
    }
}
