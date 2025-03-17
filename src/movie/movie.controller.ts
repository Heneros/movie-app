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
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
    ApiBearerAuth,
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
import { Throttle } from '@nestjs/throttler';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllFavoritesQuery } from './queries/favorite/getAllFavorite.query';
import { UpdateMovieCommand } from './commands/updateMovie.command';
import { SearchMovieQuery } from './queries/searchMovie.query';
import { plainToInstance } from 'class-transformer';
import { FindAllMovieQuery } from './queries/findAllMovie.query';
import { FindDraftsMovieQuery } from './queries/findDrafts.query';
import { FindOneMovieQuery } from './queries/findOneMovie.query';
import { CreateMovieCommand } from './commands/createMovie.command';
import { RemoveMovieHandler } from './handlers/removeMovie.handler';
import { RemoveMovieCommand } from './commands/removeMovie.command';
import { AddMovieFavCommand } from './commands/favorite/addMovieFavorite.command';
import { RemoveMovieFavCommand } from './commands/favorite/removeMovieFavorite.command';
import { RateMovieCommand } from './commands/rateMovie.command';
import { MovieRepository } from './repositories/movie.repository';
import { CheckUserExistPipe } from '@/users/pipe/CheckUserExist.pipe';

@Controller('movie')
@ApiTags('Movie')
// @UseInterceptors(TimeoutInterceptor)
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

        private readonly movieRepository: MovieRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,

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

        // const movies = (await this.movieFindAllService.findAll(
        //     skip,
        // )) as Movie[];
        const movies = await this.queryBus.execute(new FindAllMovieQuery(skip));
        // console.log(movies);
        // return movies;
        return movies.allMovies.map((movie: Movie) => new MovieEntity(movie));
    }

    @Get('search')
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

        // return movies;
        return movies.map((draft) => new MovieEntity(draft));
        // return movies.map((movie) => new MovieEntity(movie));
    }

    @Get('drafts')
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: MovieEntity, isArray: true })
    async findDrafts(@Query('page') pageString?: string) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        // const drafts = (await this.movieFindDraftsService.findDrafts(
        //     skip,
        // )) as Movie[];
        const movies = await this.queryBus.execute(
            new FindDraftsMovieQuery(skip),
        );

        return movies.map((draft) => new MovieEntity(draft));
    }

    // @Public()
    @Get(':id')
    @ApiOkResponse({ type: MovieEntity })
    async findOne(@Param('id', ParseIntPipe, CheckMovieExistPipe) id: number) {
        // const movie = await this.movieFindOneService.findOne(+id);
        const movie = await this.queryBus.execute(new FindOneMovieQuery(id));
        // if (!movie) {
        //     throw new NotFoundException(`movie with ${id} does not exist.`);
        // }
        return new MovieEntity(movie);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @ApiCreatedResponse({ type: MovieEntity })
    @ApiBearerAuth('access-token')
    async create(@Body() createMovieDto: CreateMovieDto, @User() user: User) {
        if (!user || !user.id) {
            throw new Error('User not found or unauthorized');
        }
        createMovieDto.authorId = user.id;

        const movie = await this.commandBus.execute(
            new CreateMovieCommand(createMovieDto),
        );
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
        return await this.commandBus.execute(
            new UpdateMovieCommand(id, updateMovieDto),
        );
    }

    @Delete(':id')
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
        // const movie = await this.movieFindOneService.findOne(id);
        const movie = await this.queryBus.execute(new FindOneMovieQuery(id));
        if (!movie) {
            throw new NotFoundException(`movie with ${id} does not exist.`);
        }
        return new MovieEntity(
            await this.commandBus.execute(new RemoveMovieCommand(id)),
        );
        // return new MovieEntity(await this.movieRemoveService.remove(id));
    }

    @Post(':id/addFav')
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

    @Delete(':userId/removeFav')
    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @ApiOperation({ summary: 'Remove from favorite list user.' })
    @ApiOkResponse({
        description: 'Remove favorite movie from list',
        type: MovieEntity,
    })
    @ApiBearerAuth('access-token')
    async removeMovieFavorite(
        @Param('userId', ParseIntPipe) userId: number,
        @Body('movieId', ParseIntPipe, CheckMovieExistPipe) movieId: number,
    ): Promise<MovieEntity> {
        return new MovieEntity(
            await this.commandBus.execute(
                new RemoveMovieFavCommand(movieId, userId),
            ),
        );
    }

    @Get(':id/allFavorites')
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

        // return favoriteMovies;
        const movieIds = favoriteMovies.map((fav) => fav.movieId);

        const movies = await this.movieRepository.findManyMovieIn(
            skip,
            movieIds,
        );

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

        return await this.commandBus.execute(
            new RateMovieCommand(movieId, user.id, rateMovieDto.rating),
        );
    }
}
