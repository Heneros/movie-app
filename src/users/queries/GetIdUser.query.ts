import { IQuery } from '@nestjs/cqrs';

export class GetIdUserQuery implements IQuery {
    constructor(public id: number) {}
}
