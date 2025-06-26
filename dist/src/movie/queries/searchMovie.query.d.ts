import { IQuery } from '@nestjs/cqrs';
export declare class SearchMovieQuery implements IQuery {
    readonly searchText: string;
    readonly skip: number;
    constructor(searchText: string, skip?: number);
}
