import { IQuery } from '@nestjs/cqrs';
export declare class GetReviewsQuery implements IQuery {
    readonly skip: number;
    constructor(skip?: number);
}
