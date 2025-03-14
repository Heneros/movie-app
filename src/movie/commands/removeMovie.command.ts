import { ICommand } from '@nestjs/cqrs';

export class RemoveMovieCommand implements ICommand {
    constructor(public readonly id: number) {}
}
