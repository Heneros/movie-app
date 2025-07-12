import { IQuery } from '@nestjs/cqrs';
export declare class FindAuthorMovieQuery implements IQuery {
    readonly id: number;
    constructor(id: number);
}
