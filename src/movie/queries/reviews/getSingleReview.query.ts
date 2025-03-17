import { IQuery } from '@nestjs/cqrs';

export class GetSingleReviewQuery implements IQuery {
    constructor(public readonly id: number) {}
}
