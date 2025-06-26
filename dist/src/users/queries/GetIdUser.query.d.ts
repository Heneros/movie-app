import { IQuery } from '@nestjs/cqrs';
export declare class GetIdUserQuery implements IQuery {
    id: number;
    constructor(id: number);
}
