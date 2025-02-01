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
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { PAGINATION_LIMIT } from 'src/data/defaultData';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { SearchMovieDto } from './dto/search-movie.dto';
import { TimeoutInterceptor } from 'src/interceptor/timeout.interceptor';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('movie')
@ApiTags('Movie')
@UseInterceptors(TimeoutInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Public()
  @Get()
  @CacheTTL(30)
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

    const movies = await this.movieService.findAll(skip);
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
    const movies = await this.movieService.searchByTitle(searchMovieDto);

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
    const drafts = await this.movieService.findDrafts();

    return drafts.map((draft) => new MovieEntity(draft));
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieService.findOne(+id);
    if (!movie) {
      throw new NotFoundException(`movie with ${id} does not exist.`);
    }
    return new MovieEntity(movie);
  }

  @Post()
  // @Roles(['admin'])
  @ApiCreatedResponse({ type: MovieEntity })
  @Roles('Admin', 'Editor')

  // @ApiParam({name: 'id', description})
  async create(@Body() createMovieDto: CreateMovieDto, @User() user: User) {
    if (!user || !user.id) {
      throw new Error('User not found or unauthorized');
    }
    createMovieDto.authorId = user.id;

    return new MovieEntity(await this.movieService.create(createMovieDto));
  }

  @Patch(':id')
  @Roles('Admin', 'Editor')
  @ApiOkResponse({ type: MovieEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return new MovieEntity(await this.movieService.update(id, updateMovieDto));
  }

  @Delete(':id')
  @Roles('Admin', 'Editor')
  @ApiOkResponse({ type: MovieEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieService.findOne(id);

    if (!movie) {
      throw new NotFoundException(`movie with ${id} does not exist.`);
    }
    return new MovieEntity(await this.movieService.remove(id));
  }
}
