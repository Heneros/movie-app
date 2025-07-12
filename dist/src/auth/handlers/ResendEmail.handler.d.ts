import { ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { LoggerService } from '@nestjs/common';
import { ResendEmailCommand } from '../commands';
export declare class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
    private readonly logger;
    private readonly authRepository;
    private readonly mailService;
    constructor(logger: LoggerService, authRepository: AuthRepository, mailService: MailService);
    execute(command: ResendEmailCommand): Promise<{
        message: string;
        status: number;
    }>;
}
