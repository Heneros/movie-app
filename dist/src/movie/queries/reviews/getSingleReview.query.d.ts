import { IQuery } from '@nestjs/cqrs';
export declare class GetSingleReviewQuery implements IQuery {
    readonly id: number;
    constructor(id: number);
}
