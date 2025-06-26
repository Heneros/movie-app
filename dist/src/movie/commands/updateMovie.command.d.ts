import { ICommand } from '@nestjs/cqrs';
import { UpdateMovieDto } from '../dto-input/update-movie.dto';
export declare class UpdateMovieCommand implements ICommand {
    readonly id: number;
    readonly updateMovieDto: UpdateMovieDto;
    constructor(id: number, updateMovieDto: UpdateMovieDto);
}
