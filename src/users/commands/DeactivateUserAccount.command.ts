import { ICommand } from '@nestjs/cqrs';

export class DeactivateUserAccount implements ICommand {
    constructor(public id: number) {}
}
