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
  @SetMetadata('roles', ['admin'])
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
  async findOne(@Param('id') id: string) {
    const article = await this.movieService.findOne(+id);

    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }
    return article;
  }

  // Patch /
  @Patch(':id')
  @ApiOkResponse({ type: MovieEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return new MovieEntity(await this.movieService.update(id, updateMovieDto));
  }

  // Delete /
  @Delete(':id')
  @ApiOkResponse({ type: MovieEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new MovieEntity(await this.movieService.remove(id));
  }
}
