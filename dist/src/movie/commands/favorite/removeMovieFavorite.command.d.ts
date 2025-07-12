import { ICommand } from '@nestjs/cqrs';
export declare class RemoveMovieFavCommand implements ICommand {
    readonly movieId: number;
    readonly userId: number;
    constructor(movieId: number, userId: number);
}
