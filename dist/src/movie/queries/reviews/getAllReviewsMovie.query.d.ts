import { IQuery } from '@nestjs/cqrs';
export declare class GetReviewsByMovieQuery implements IQuery {
    readonly id: number;
    readonly page: number;
    constructor(id: number, page?: number);
}
