import { IQuery } from '@nestjs/cqrs';
export declare class VerifyEmailQuery implements IQuery {
    readonly token: string;
    readonly userId: number;
    constructor(token: string, userId: number);
}
