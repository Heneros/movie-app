import { ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../commands';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';
import { Cache } from 'cache-manager';
export declare class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
    private readonly cacheManager;
    private readonly authRepository;
    private readonly mailService;
    constructor(cacheManager: Cache, authRepository: AuthRepository, mailService: MailService);
    execute(command: ResetPasswordCommand): Promise<{
        message: string;
    }>;
}
