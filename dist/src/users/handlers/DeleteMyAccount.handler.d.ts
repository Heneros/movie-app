import { ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteMyAccountCommand } from '../commands';
import { Cache } from '@nestjs/cache-manager';
export declare class DeleteMyAccountHandler implements ICommandHandler<DeleteMyAccountCommand> {
    private cacheManager;
    private readonly usersRepository;
    constructor(cacheManager: Cache, usersRepository: UsersRepository);
    execute(command: DeleteMyAccountCommand): Promise<string>;
}
