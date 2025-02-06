import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { Response } from 'express';
import { tempLoginDate } from '../../data/defaultData';

@Injectable()
export class VerifyEmailService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async verifyEmail(res: Response, verifyEmailDto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: verifyEmailDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found ');
    }

    if (user?.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    const emailVerificationToken =
      await this.prisma.verifyResetToken.findUnique({
        where: {
          userId: user.id,
          token: verifyEmailDto.emailToken,
        },
      });

    if (!emailVerificationToken) {
      throw new BadRequestException('Not found token');
    }

    if (new Date() > emailVerificationToken.expiresAt) {
      throw new BadRequestException('Expired token or invalid token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
      },
    });

    await this.prisma.verifyResetToken.update({
      where: {
        userId: user.id,
        token: verifyEmailDto.emailToken,
      },
      data: {
        expiresAt: tempLoginDate,
      },
    });

    await this.mailService.sendEmail(
      false,
      user,
      'Your email is verified!',
      './welcome',
      emailVerificationToken,
    );

    res.status(200).json({ message: 'Your email is verified!' });
  }
}
