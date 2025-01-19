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
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { PAGINATION_LIMIT } from 'src/data/defaultData';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  private readonly paginationLimit: number;

  constructor(private readonly movieService: MovieService) {
    this.paginationLimit = Number(process.env.PAGINATION);
  }

  @Post()
  // @Roles(['admin'])
  @ApiCreatedResponse({ type: MovieEntity })
  @Roles('Admin', 'Editor')

  // @ApiParam({name: 'id', description})
  async create(@Body() createMovieDto: CreateMovieDto) {
    return new MovieEntity(await this.movieService.create(createMovieDto));
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findAll(@Query('page') pageString?: string) {
    const page = pageString ? Math.max(1, parseInt(pageString, 10)) : 1;
    const skip = (page - 1) * this.paginationLimit;

    const movies = await this.movieService.findAll(skip);
    return movies.map((movie) => new MovieEntity(movie));
  }
  @Get('drafts')
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.movieService.findDrafts();

    return drafts.map((draft) => new MovieEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  async findOne(@Param('id') id: string) {
    const movie = await this.movieService.findOne(+id);

    if (!movie) {
      throw new NotFoundException(`movie with ${id} does not exist.`);
    }
    return movie;
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

  // Delete /
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
