import { ICommand } from '@nestjs/cqrs';

export class DeleteMyAccountCommand implements ICommand {
    constructor(public id: number) {}
}
