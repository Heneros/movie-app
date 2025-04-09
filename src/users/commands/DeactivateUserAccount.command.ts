import { ICommand } from '@nestjs/cqrs';

export class DeactivateUserAccountCommand implements ICommand {
    constructor(public id: number) {}
}
