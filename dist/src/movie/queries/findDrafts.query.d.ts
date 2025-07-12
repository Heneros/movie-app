import { IQuery } from '@nestjs/cqrs';
export declare class FindDraftsMovieQuery implements IQuery {
    readonly skip: number;
    constructor(skip?: number);
}
