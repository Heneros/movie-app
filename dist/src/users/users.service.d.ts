import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
export declare class UsersService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
}
