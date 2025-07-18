import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../commands';
import { AuthRepository } from '../repositories/Auth.repository';
import { MailService } from '@/mail/mail.service';
import { BadRequestException, Inject } from '@nestjs/common';
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
        const { userId, resetPasswordDto } = command;
        if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
            throw new BadRequestException('Password do not match');
        }

        const verificationToken = await this.authRepository.findToken({
            userId,
        });
        // console.log(verificationToken);
        if (!verificationToken || new Date() > verificationToken.expiresAt) {
            throw new BadRequestException(
                'Your token is either invalid or expired. Try resetting your password again',
            );
            return;
        }
        const user = await this.authRepository.findUser({
            userId,
        });
        if (user && verificationToken) {
            const newPass = await bcrypt.hash(
                resetPasswordDto.password,
                roundsOfHashing,
            );

            const updateUser = await this.authRepository.updatePassword(
                user.id,
                newPass,
            );
            const payload = {
                name: updateUser.name,
                link: null,
            };

            await this.mailService.resendEmail(
                updateUser,
                'Your password was reset successfully!',
                './resetPassword',
                payload,
            );

            return {
                message: 'Your password was reset successfully!',
            };
        }
    }
}
