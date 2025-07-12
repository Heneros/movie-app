import { ICommand } from '@nestjs/cqrs';
export declare class AddMovieFavCommand implements ICommand {
    readonly movieId: number;
    readonly userId: number;
    constructor(movieId: number, userId: number);
}
