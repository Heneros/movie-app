import { IQueryHandler } from '@nestjs/cqrs';
import { VerifyEmailQuery } from '../queries';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';
export declare class VerifyEmailHandler implements IQueryHandler<VerifyEmailQuery> {
    private readonly authRepository;
    private mailService;
    constructor(authRepository: AuthRepository, mailService: MailService);
    execute(query: VerifyEmailQuery): Promise<{
        id: number;
        message: string;
    }>;
}
