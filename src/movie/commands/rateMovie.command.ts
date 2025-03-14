import { ICommand } from '@nestjs/cqrs';
import { CreateMovieDto } from './../dto/create-movie.dto';
import { RateMovieDto } from '../dto/rate-movie.dto';

export class RateMovieCommand implements ICommand {
    constructor(
        public readonly movieId: number,
        public readonly userId: number,
        public readonly value: number,
    ) {}
}
