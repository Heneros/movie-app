import { IQuery } from '@nestjs/cqrs';

export class FindDraftsMovieQuery implements IQuery {
    constructor(public readonly skip: number = 0) {}
}
