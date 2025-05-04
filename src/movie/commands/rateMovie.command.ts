import { ICommand } from '@nestjs/cqrs';

export class RateMovieCommand implements ICommand {
    constructor(
        public readonly movieId: number,
        public readonly userId: number,
        public readonly value: number,
    ) {}
}
