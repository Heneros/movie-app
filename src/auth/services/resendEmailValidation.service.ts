import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { MailService } from '../../mail/mail.service';
import { domain, tempRegisterDate } from '../../data/defaultData';
import { randomBytes } from 'crypto';
import { Response } from 'express';

@Injectable()
export class ResendEmailService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async resendEmailValidation(res: Response, resendEmailDto: ResendEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendEmailDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('User already verified');
    }

    const verificationToken = await this.prisma.verifyResetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (verificationToken) {
      await this.prisma.verifyResetToken.delete({
        where: {
          userId: user.id,
        },
      });
    }
    const resentToken = randomBytes(32).toString('hex');

    const emailToken = await this.prisma.verifyResetToken.create({
      data: {
        userId: user.id,
        token: resentToken,
        expiresAt: tempRegisterDate,
      },
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
    res.status(200).json({ message: 'Email was successfully sent' });
  }
}
