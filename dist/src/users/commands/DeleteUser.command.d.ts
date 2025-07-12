import { ICommand } from '@nestjs/cqrs';
export declare class DeleteUserCommand implements ICommand {
    id: number;
    constructor(id: number);
}
