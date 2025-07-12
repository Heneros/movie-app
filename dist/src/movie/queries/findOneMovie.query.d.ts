import { IQuery } from '@nestjs/cqrs';
export declare class FindOneMovieQuery implements IQuery {
    readonly id: number;
    constructor(id: number);
}
