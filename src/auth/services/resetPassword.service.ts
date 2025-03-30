import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ResetPasswordDto } from '../dto/Reset-password.dto';
import { MailService } from '@/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { roundsOfHashing } from '@/data/defaultData';
import { Response } from 'express';

@Injectable()
export class ResetPasswordService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
    ) {}

    async resetPassword(res: Response, resetPasswordDto: ResetPasswordDto) {
        if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
            throw new BadRequestException('Password do not match');
        }

        const verificationToken = await this.prisma.verifyResetToken.findUnique(
            {
                where: {
                    userId: 1, ///resetPasswordDto.userId,
                },
            },
        );
        if (!verificationToken || new Date() > verificationToken.expiresAt) {
            throw new BadRequestException(
                'Your token is either invalid or expired. Try resetting your password again',
            );
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: verificationToken.userId,
            },
        });

        if (user && verificationToken) {
            const newPass = await bcrypt.hash(
                resetPasswordDto.password,
                roundsOfHashing,
            );

            const user = await this.prisma.user.update({
                where: {
                    id: verificationToken.userId,
                },
                data: {
                    password: newPass,
                },
            });

            // console.log(user);
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
