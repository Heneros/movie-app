import { IQuery } from '@nestjs/cqrs';

export class GetReviewsByMovieQuery implements IQuery {
    constructor(
        public readonly id: number,
        public readonly page: number = 0,
    ) {}
}
