import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../commands';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import { roundsOfHashing } from '@/data/defaultData';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
    implements ICommandHandler<ResetPasswordCommand>
{
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly mailService: MailService,
    ) {}

    async execute(command: ResetPasswordCommand) {
        const { userId, resetPasswordDto, res } = command;
        if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
            throw new BadRequestException('Password do not match');
        }

        const verificationToken = await this.authRepository.findToken({
            userId,
        });

        if (!verificationToken || new Date() > verificationToken.expiresAt) {
            throw new BadRequestException(
                'Your token is either invalid or expired. Try resetting your password again',
            );
        }
        const user = await this.authRepository.findUser({
            userId,
        });
        if (user && verificationToken) {
            const newPass = await bcrypt.hash(
                resetPasswordDto.password,
                roundsOfHashing,
            );

            const user = await this.authRepository.updateUser({
                userId,
                password: newPass,
            });
            const payload = {
                name: user.name,
                link: null,
            };

            await this.mailService.resendEmail(
                user,
                'Your password was reset successfully!',
                './resetPassword',
                payload,
            );

            res.status(200).json({
                message: 'Your password was reset successfully!',
            });
        }
    }
}
