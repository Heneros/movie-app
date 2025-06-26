import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/CreateUser.command';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
export declare class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    private readonly authRepository;
    private readonly mailService;
    constructor(authRepository: AuthRepository, mailService: MailService);
    execute(command: CreateUserCommand): Promise<{
        id: number;
        email: string;
        name: string;
        accessToken: string;
    }>;
}
