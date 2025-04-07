import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { domain, roundsOfHashing, tempRegisterDate } from '@/data/defaultData';
import { ResendEmailCommand } from '../commands';

@CommandHandler(ResendEmailCommand)
export class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,
    ) {}

    async execute(command: ResendEmailCommand) {
        try {
            const { userId, email } = command;

            // console.log(userId, email);
            const user = await this.authRepository.findUser({
                email,
            });

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
            //   res.status(200).json({ message: 'Email was successfully sent' });

            return {
                message: 'Email was successfully sent',
                status: 200,
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Error sending email');
        }
    }
}
