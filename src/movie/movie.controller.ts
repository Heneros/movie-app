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
  SetMetadata,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  // @Roles(['admin'])
  @ApiCreatedResponse({ type: MovieEntity })
  @Roles('Admin', 'Editor')
  async create(@Body() createMovieDto: CreateMovieDto) {
    return new MovieEntity(await this.movieService.create(createMovieDto));
  }

  @Get()
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 2) {
    const skip = (page - 1) * limit;

    const movies = await this.movieService.findAll(skip, limit);

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
