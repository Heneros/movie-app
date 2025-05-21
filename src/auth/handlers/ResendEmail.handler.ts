import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import {
    BadRequestException,
    HttpException,
    Inject,
    LoggerService,
    NotFoundException,
} from '@nestjs/common';
import { domain, roundsOfHashing, tempRegisterDate } from '@/data/defaultData';
import { ResendEmailCommand } from '../commands';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@CommandHandler(ResendEmailCommand)
export class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,
    ) {}

    async execute(command: ResendEmailCommand) {
        try {
            const { userId, email } = command;

            // console.log(userId, email);
            const user = await this.authRepository.findUserByEmail({
                email,
            });

            // console.log('useruser', user);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            // console.log(user);
            if (user.isEmailVerified) {
                throw new BadRequestException('User already verified');
            }
            const verificationToken = await this.authRepository.findToken({
                userId,
            });

            if (verificationToken) {
                await this.authRepository.deleteToken({
                    userId,
                });
            }
            const token = randomBytes(32).toString('hex');

            const emailToken = await this.authRepository.createToken({
                userId,
                token,
                tempDate: tempRegisterDate,
            });

            const emailLink = `${domain}/auth/verify/${emailToken.token}/${user.id}`;

            const payload = {
                name: user.name,
                link: emailLink,
            };

            await this.mailService.resendEmail(
                user,
                'Welcome to Movie App! Confirm your Email ',
                './confirmation',
                payload,
            );

            return {
                message: 'Email was successfully sent',
                status: 200,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            // console.error(error);
            this.logger.log(`Error verify user email ${command.email}`);

            throw new BadRequestException('Error sending email');
        }
    }
}
