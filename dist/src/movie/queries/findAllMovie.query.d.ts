import { IQuery } from '@nestjs/cqrs';
export declare class FindAllMovieQuery implements IQuery {
    readonly skip: number;
    constructor(skip?: number);
}
