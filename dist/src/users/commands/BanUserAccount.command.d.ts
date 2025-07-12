import { ICommand } from '@nestjs/cqrs';
export declare class BanUserAccountCommand implements ICommand {
    id: number;
    constructor(id: number);
}
