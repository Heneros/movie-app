import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
interface EmailVerificationToken {
    token: string;
    url?: string;
}
interface ResendEmail {
    name: string;
    link: string;
}
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendEmail(verifyEmail: boolean, user: User, subject: string, template: string, emailVerificationToken: EmailVerificationToken): Promise<void>;
    resendEmail(user: User, subject: string, template: string, payload: ResendEmail): Promise<void>;
}
export {};
