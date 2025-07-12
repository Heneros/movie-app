import { IQuery } from '@nestjs/cqrs';
export declare class FindAllUsersQuery implements IQuery {
    page: number;
    constructor(page?: number);
}
