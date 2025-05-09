import { IQuery } from '@nestjs/cqrs';

export class FindAuthorMovieQuery implements IQuery {
    constructor(public readonly id: number) {}
}
