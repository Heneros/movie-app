import { ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../repositories/users.repository';
import { BanUserAccountCommand } from '../commands';
export declare class BanUserAccountHandler implements ICommandHandler<BanUserAccountCommand> {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(command: BanUserAccountCommand): Promise<string>;
}
