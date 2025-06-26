import { ICommand } from '@nestjs/cqrs';
export declare class RemoveMovieCommand implements ICommand {
    readonly id: number;
    constructor(id: number);
}
