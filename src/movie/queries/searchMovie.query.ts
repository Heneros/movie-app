import { IQuery } from '@nestjs/cqrs';

export class SearchMovieQuery implements IQuery {
    constructor(
        public readonly searchText: string,
        public readonly skip: number = 0,
    ) {}
}
