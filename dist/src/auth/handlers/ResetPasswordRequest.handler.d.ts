import { ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { ResetPasswordRequestCommand } from '../commands';
export declare class ResetPasswordRequestHandler implements ICommandHandler<ResetPasswordRequestCommand> {
    private readonly authRepository;
    private readonly mailService;
    constructor(authRepository: AuthRepository, mailService: MailService);
    execute(command: ResetPasswordRequestCommand): Promise<void>;
}
