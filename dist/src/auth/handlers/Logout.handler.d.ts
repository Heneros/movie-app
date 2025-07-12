import { ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../repositories/Auth.repository';
import { LogoutCommand } from '../commands';
export declare class LogoutHandler implements ICommandHandler<LogoutCommand> {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    execute(command: LogoutCommand): Promise<import("express").Response<any, Record<string, any>> | "Logged out successfully">;
}
