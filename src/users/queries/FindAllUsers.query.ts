import { IQuery } from '@nestjs/cqrs';

export class FindAllUsersQuery implements IQuery {
    constructor(public page: number = 1) {}
}
