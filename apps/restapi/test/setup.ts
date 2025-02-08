import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { MailModule } from '../src/mail/mail.module';
import { MailService } from '../src/mail/mail.service';
import { clearDatabase } from './helpers/db-helper';
import { AuthModule } from '../src/auth/auth.module';

export let app: INestApplication;

const mockMailService = {
  sendEmail: jest.fn().mockImplementation(() => Promise.resolve(true)),
};
let userData;
const testUserFile = path.join(__dirname, './data/testUser.json');

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule, AuthModule, MailModule],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor,
      },
    ],
  })
    .overrideProvider(MailService)
    .useValue(mockMailService)
    .compile();

  app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  const prisma = app.get(PrismaService);
  await clearDatabase(prisma);

  // userData = {
  //   id: 1,
  //   name: 'John Doe',
  //   email: 'test@example.com',
  //   password: 'password123',
  //   passwordConfirm: 'password123',
  //   isEmailVerified: false,
  // };

  // const createUserResponse = await request(app.getHttpServer())
  //   .post('/auth/register')
  //   .send(userData)
  //   .expect(201);

  // userData.id = createUserResponse.body.id;

  // fs.writeFileSync(
  //   testUserFile,
  //   JSON.stringify({
  //     id: Number(userData.id),
  //     email: userData.email,
  //     token: createUserResponse.body.token,
  //   }),
  //   'utf8',
  // );
});

afterAll(async () => {
  const prisma = app.get(PrismaService);
  await clearDatabase(prisma);
  await app.close();
});
