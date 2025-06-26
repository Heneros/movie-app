import { ICommand } from '@nestjs/cqrs';
import { CreateMovieDto } from '../dto-input/create-movie.dto';
export declare class CreateMovieCommand implements ICommand {
    readonly userId: number;
    readonly createMovieDto: CreateMovieDto;
    constructor(userId: number, createMovieDto: CreateMovieDto);
}
