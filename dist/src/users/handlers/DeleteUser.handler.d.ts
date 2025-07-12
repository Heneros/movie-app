import { ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, LoggerService, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './../repositories/users.repository';
import { DeleteUserCommand } from '../commands';
import { Cache } from 'cache-manager';
export declare class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    private readonly logger;
    private readonly cacheManager;
    private readonly usersRepository;
    constructor(logger: LoggerService, cacheManager: Cache, usersRepository: UsersRepository);
    execute(command: DeleteUserCommand): Promise<string | ForbiddenException | NotFoundException>;
}
