import { IQuery } from '@nestjs/cqrs';

export class GetReviewsQuery implements IQuery {
    constructor(public readonly skip: number = 0) {}
}
