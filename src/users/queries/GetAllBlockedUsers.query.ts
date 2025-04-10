import { IQuery } from '@nestjs/cqrs';

export class GetAllBlockedUsersQuery implements IQuery {
    constructor(public page: number = 1) {}
}
