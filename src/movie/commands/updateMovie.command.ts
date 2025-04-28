import { ICommand } from '@nestjs/cqrs';
import { UpdateMovieDto } from '../dto-input/update-movie.dto';

export class UpdateMovieCommand implements ICommand {
    constructor(
        public readonly id: number,
        public readonly updateMovieDto: UpdateMovieDto,
    ) {}
}
