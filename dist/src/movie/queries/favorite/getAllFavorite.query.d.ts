import { IQuery } from '@nestjs/cqrs';
export declare class GetAllFavoritesQuery implements IQuery {
    readonly userId: number;
    readonly skip: number;
    constructor(userId: number, skip?: number);
}
