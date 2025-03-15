import { IQuery } from '@nestjs/cqrs';

export class GetAllFavoritesQuery implements IQuery {
    constructor(
        public readonly userId: number,
        public readonly skip: number = 0,
    ) {}
}
