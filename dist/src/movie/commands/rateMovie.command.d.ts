import { ICommand } from '@nestjs/cqrs';
export declare class RateMovieCommand implements ICommand {
    readonly movieId: number;
    readonly userId: number;
    readonly value: number;
    constructor(movieId: number, userId: number, value: number);
}
