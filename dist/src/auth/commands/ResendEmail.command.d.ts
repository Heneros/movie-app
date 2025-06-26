import { ICommand } from '@nestjs/cqrs';
export declare class ResendEmailCommand implements ICommand {
    readonly userId: number;
    readonly email: string;
    constructor(userId: number, email: string);
}
