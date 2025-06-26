import { ICommand } from '@nestjs/cqrs';
import { FilterMovieDto } from '../dto-input/filter-movie.dto';
export declare class FilterMoviesCommand implements ICommand {
    readonly filters: FilterMovieDto;
    constructor(filters: FilterMovieDto);
}
