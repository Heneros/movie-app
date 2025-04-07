import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VerifyEmailQuery } from '../queries';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@QueryHandler(VerifyEmailQuery)
export class VerifyEmailHandler implements IQueryHandler<VerifyEmailQuery> {
    constructor(
        // private readonly prisma: PrismaService,
        private readonly authRepository: AuthRepository,
        private mailService: MailService,
    ) {}

    async execute(query: VerifyEmailQuery) {
        const { userId, token } = query;

        const user = await this.authRepository.findUser({ userId: userId });

        if (!user) {
            throw new NotFoundException('User not found ');
        }

        if (user?.isEmailVerified) {
            throw new BadRequestException('Email already verified');
        }

        const emailVerificationToken = await this.authRepository.findToken({
            userId: user.id,
            token,
        });

        if (!emailVerificationToken) {
            throw new BadRequestException('Not found token');
        }

        if (new Date() > emailVerificationToken.expiresAt) {
            throw new BadRequestException('Expired token or invalid token');
        }

        // console.log(emailVerificationToken);

        await this.authRepository.verifyUser(emailVerificationToken.userId);

        await this.authRepository.updateToken(
            emailVerificationToken.userId,
            emailVerificationToken.token,
        );

        await this.mailService.sendEmail(
            false,
            user,
            'Your email is verified!',
            './welcome',
            emailVerificationToken,
        );
        return {
            id: user.id,
            message: 'Your email is verified!',
        };

        // res.status(200).json({ message: 'Your email is verified!' });
    }
}
