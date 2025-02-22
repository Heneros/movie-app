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
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
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

    const movies = (await this.movieFindAllService.findAll(skip)) as Movie[];

    return movies.map((movie) => new MovieEntity(movie));
  }

  // @Public()
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
    @Query(new ValidationPipe())
    searchMovieDto: SearchMovieDto,
  ): Promise<MovieEntity[]> {
    const movies = await this.movieSearchService.searchByTitle(searchMovieDto);

    if (!movies || movies.length === 0) {
      throw new NotFoundException(
        `Movies with title '${searchMovieDto.title}' do not exist.`,
      );
    }

    return movies.map((movie) => new MovieEntity(movie));
  }

  @Get('drafts')
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.movieFindDraftsService.findDrafts();

    return drafts.map((draft) => new MovieEntity(draft));
  }

  // @Public()
  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieFindOneService.findOne(+id);
    if (!movie) {
      throw new NotFoundException(`movie with ${id} does not exist.`);
    }
    return new MovieEntity(movie);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: MovieEntity })
  @Roles('Admin', 'Editor')
  async create(@Body() createMovieDto: CreateMovieDto, @User() user: User) {
    if (!user || !user.id) {
      throw new Error('User not found or unauthorized');
    }
    createMovieDto.authorId = user.id;

    return new MovieEntity(
      await this.movieCreateService.create(createMovieDto),
    );
  }

  @Patch(':id')
  @Roles('Admin', 'Editor')
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add to favorite list user.' })
  @ApiOkResponse({ type: MovieEntity })
  async removeMovieFavorite(
    @Param('id', ParseIntPipe) movieId: number,
    @Body('userId') userObjectId: number,
  ) {
    const movie = await this.movieFindOneService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException(`movie with ${movieId} does not exist.`);
    }

    const userId = userObjectId;
    return new MovieEntity(
      await this.movieFavorite.removeMovieFav(movieId, userId),
    );
  }

  @Get(':id/allFavorites')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'All favorite list user.' })
  @ApiOkResponse({ type: [MovieEntity] })
  async allFavorites(@Param('id', ParseIntPipe) @User() user: User) {
    // const userIdSt = userId;

    const favoriteMovies = await this.movieFavorite.getAllFavorites(user.id);

    // console.log('allFavorites', user);
    const movieIds = favoriteMovies.map((fav) => fav.movieId);

    const movies = await this.prisma.movie.findMany({
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
  async rateMovie(
    @Param('id', ParseIntPipe, CheckMovieExistPipe) movieId: number,
    @User('id') user: User,
    @Body('rating', ParseIntPipe) value: number,
  ) {
    // console.log(value);

    return await this.movieRateService.rateMovie(movieId, user.id, value);
    // const userIdSt = userId;
  }
}
