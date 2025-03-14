import { ICommand } from '@nestjs/cqrs';
import { CreateMovieDto } from './../dto/create-movie.dto';

export class CreateMovieCommand implements ICommand {
    constructor(
        // public readonly user: User,
        public readonly createMovieDto: CreateMovieDto,
    ) {}
}
