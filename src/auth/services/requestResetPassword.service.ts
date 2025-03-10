import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { MailService } from '@/mail/mail.service';
import { randomBytes } from 'crypto';
import { domain, tempRequestPassDate } from '@/data/defaultData';
import { Response } from 'express';

@Injectable()
export class RequestResetPasswordService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async requestResetPassword(res: Response, resendEmailDto: ResendEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendEmailDto.email },
    });

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
        createdAt: new Date().toISOString(),
        expiresAt: tempRequestPassDate,
      },
    });

    // if (user.isEmailVerified) {
    //   throw new BadRequestException('User already verified');
    // }

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
