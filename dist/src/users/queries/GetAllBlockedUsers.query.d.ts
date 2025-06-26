import { IQuery } from '@nestjs/cqrs';
export declare class GetAllBlockedUsersQuery implements IQuery {
    page: number;
    constructor(page?: number);
}
