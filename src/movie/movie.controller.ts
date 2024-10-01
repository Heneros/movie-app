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
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  findAll() {
    return this.movieService.findAll();
  }

  @Get('drafts')
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  findDrafts() {
    return this.movieService.findDrafts();
  }

  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.movieService.findOne(id);
  // }
  async findOne(@Param('id') id: string) {
    const movie = await this.movieService.findOne(+id);
    if (!movie) {
      throw new NotFoundException(`Movie with ${id} does not exist.`);
    }

    return movie;
  }

  @Patch(':id')
  @ApiOkResponse({ type: MovieEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MovieEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
