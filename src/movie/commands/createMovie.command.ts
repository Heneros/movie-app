import { ICommand } from '@nestjs/cqrs';
import { CreateMovieDto } from '../dto-input/create-movie.dto';

export class CreateMovieCommand implements ICommand {
    constructor(public readonly createMovieDto: CreateMovieDto) {}
}
