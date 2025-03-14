import { ICommand } from '@nestjs/cqrs';

export class AddMovieFavCommand implements ICommand {
    constructor(
        public readonly movieId: number,
        public readonly userId: number,
    ) {}
}
