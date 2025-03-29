import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VerifyEmailQuery } from '../queries';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';

@QueryHandler(VerifyEmailQuery)
export class VerifyEmailHandler implements IQueryHandler<VerifyEmailQuery> {
    constructor(
        // private readonly prisma: PrismaService,
        private readonly authRepository: AuthRepository,
        private mailService: MailService,
    ) {}

    async execute(query: VerifyEmailQuery) {
        const { res, userId, verifyEmailDto } = query;

        const user = await this.authRepository.findUser({ userId });

        console.log(user);
    }
}
