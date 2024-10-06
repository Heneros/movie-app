import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiCreatedResponse({ type: MovieEntity })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return new MovieEntity(await this.movieService.create(createMovieDto));
  }

  @Get()
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findAll() {
    const movies = await this.movieService.findAll();

    return movies.map((article) => new MovieEntity(article));
  }

  @Get('drafts')
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.movieService.findDrafts();

    return drafts.map((draft) => new MovieEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.movieService.findOne(id);
  // }
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const movie = await this.movieService.findOne(+id);
    // if (!movie) {
    //   throw new NotFoundException(`Movie with ${id} does not exist.`);
    // }

    // return movie;
    return new MovieEntity(await this.movieService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: MovieEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return new MovieEntity(await this.movieService.update(id, updateMovieDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: MovieEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new MovieEntity(await this.movieService.remove(id));
  }
}
