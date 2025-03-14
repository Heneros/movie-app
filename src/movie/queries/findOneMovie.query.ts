import { IQuery } from '@nestjs/cqrs';

export class FindOneMovieQuery implements IQuery {
    constructor(public readonly id: number) {}
}
