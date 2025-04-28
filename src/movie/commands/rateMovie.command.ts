import { ICommand } from '@nestjs/cqrs';
import { CreateMovieDto } from '../dto-input/create-movie.dto';
import { RateMovieDto } from '../dto-input/rate-movie.dto';

export class RateMovieCommand implements ICommand {
    constructor(
        public readonly movieId: number,
        public readonly userId: number,
        public readonly value: number,
    ) {}
}
