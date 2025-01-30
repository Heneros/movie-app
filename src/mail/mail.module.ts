import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { isDevelopment } from 'src/data/defaultData';

// console.log(isDevelopment);
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: isDevelopment ? '127.0.0.1' : process.env.SMTP_HOST,
        secure: isDevelopment ? false : true,
        port: isDevelopment ? 1025 : 587,
        auth: isDevelopment
          ? null
          : {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
      },
      defaults: {
        from: `"No Replay" <noreply@example.com>`,
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
