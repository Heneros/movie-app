import { ICommand } from '@nestjs/cqrs';
import { FilterMovieDto } from '../dto-input/filter-movie.dto';

export class FilterMoviesCommand implements ICommand {
    constructor(public readonly filters: FilterMovieDto) {}
}
