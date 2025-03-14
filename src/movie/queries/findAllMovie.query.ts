import { IQuery } from '@nestjs/cqrs';

export class FindAllMovieQuery implements IQuery {
    constructor(public readonly skip: number = 0) {}
}
