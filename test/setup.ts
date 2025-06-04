import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { MailModule } from '../src/mail/mail.module';
import { MailService } from '../src/mail/mail.service';
import { clearDatabase } from './helpers/db-helper';
import { AuthModule } from '../src/auth/auth.module';
import { GoogleService } from '@/auth/services';
import { GoogleStrategy } from '@/auth/passport/GoogleStrategy';

export let app: INestApplication;

export const mockMailService = {
    sendEmail: jest.fn().mockImplementation(() => Promise.resolve(true)),
    resendEmail: jest.fn().mockImplementation(() => Promise.resolve(true)),
};

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

        .overrideProvider(GoogleStrategy)
        .useValue({ validate: jest.fn() })


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
});

afterAll(async () => {
    const prisma = app.get(PrismaService);
    await clearDatabase(prisma);
    await app.close();

    // setTimeout(() => process.exit(0), 100);
});
