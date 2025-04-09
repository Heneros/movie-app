import { ICommand } from '@nestjs/cqrs';

export class BanUserAccountCommand implements ICommand {
    constructor(public id: number) {}
}
