import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    MovieModule,
    AuthModule,
    MailModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    ThrottlerModule.forRoot([
      {
        name: 'long',
        ttl: 6000,
        limit: 100,
      },
    ]),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_PIPE,
    //   useClass: EmailValidationPipe,
    // },
  ],
})
export class AppModule {}
