import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import { domain } from '../data/defaultData';

interface EmailVerificationToken {
  token: string;
  url?: string;
}

interface ResendEmail {
  name: string;
  link: string;
}

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    verifyEmail: boolean,
    user: User,
    subject: string,
    template: string,
    emailVerificationToken: EmailVerificationToken,
  ) {
    const link = verifyEmail
      ? `${domain}/auth/verify/${emailVerificationToken.token}/${user.id}`
      : `${domain}/auth/login`;

    // console.log(link);
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: {
        name: user.name,
        link,
      },
    });
  }

  async resendEmail(
    user: User,
    subject: string,
    template: string,
    payload: ResendEmail,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: payload,
    });
  }

  // async resendEmail(
  //   user: User,
  //   subject: string,
  //   template: string,
  //   payload: ResendEmail,
  // ) {
  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     subject: subject,
  //     template: template,
  //     context: payload,
  //   });
  // }
}
