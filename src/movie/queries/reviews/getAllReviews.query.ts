import { IQuery } from '@nestjs/cqrs';

export class FinAllReviewsQuery implements IQuery {
    constructor(public readonly page: number = 1) {}
}
