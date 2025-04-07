import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '@/mail/mail.service';
import { AuthRepository } from '../repositories/Auth.repository';
import { domain, roundsOfHashing, tempRegisterDate } from '@/data/defaultData';
import { ResetPasswordRequestCommand } from '../commands';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ResetPasswordRequestCommand)
export class ResetPasswordRequestHandler
    implements ICommandHandler<ResetPasswordRequestCommand>
{
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,
    ) {}

    async execute(command: ResetPasswordRequestCommand) {
        const { userId, resendEmailDto, res } = command;

        const user = await this.authRepository.findUser({
            email: resendEmailDto,
            userId,
        });

        const verificationToken = await this.authRepository.findToken({
            userId,
        });

        // console.log(user, verificationToken);
        if (!user) {
            throw new BadRequestException('No user exist');
        }

        if (verificationToken) {
            await this.authRepository.deleteToken({
                userId: user.id,
            });
        }
        const resentToken = randomBytes(32).toString('hex');

        const emailToken = await this.authRepository.createToken({
            userId: user.id,
            token: resentToken,
            tempDate: tempRegisterDate,
        });

        const emailLink = `${domain}/auth/reset_password?emailToken=${emailToken.token}&userId=${user.id}`;

        const payload = {
            name: user.name,
            link: emailLink,
        };

        await this.mailService.resendEmail(
            user,
            'Password Reset Request',
            './requestResetPassword',
            payload,
        );

        res.status(200).json({
            message: 'Password Reset Request',
        });
    }
}
