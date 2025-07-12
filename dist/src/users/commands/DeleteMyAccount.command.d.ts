import { ICommand } from '@nestjs/cqrs';
export declare class DeleteMyAccountCommand implements ICommand {
    userId: number;
    constructor(userId: number);
}
