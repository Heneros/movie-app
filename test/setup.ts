import {
    BadRequestException,
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { MailModule } from '../src/mail/mail.module';
import { MailService } from '../src/mail/mail.service';
import { clearDatabase } from './helpers/db-helper';
import { AuthModule } from '../src/auth/auth.module';
import { RedisService } from '@/redis/redis.service';
import { GqlThrottlerGuard } from '@/guards/gql-throttler.guard';

export const mockMailService = {
    sendEmail: jest.fn().mockResolvedValue(true),
    resendEmail: jest.fn().mockResolvedValue(true),
};
export let app: INestApplication;
export let prisma: PrismaService;
export let httpServer: any;

const mockRedisService = {
    onModuleDestroy: jest.fn().mockResolvedValue(true),
    client: {
        quit: jest.fn().mockResolvedValue(true),
        disconnect: jest.fn().mockResolvedValue(true),
    },
};

beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(MailService)
        .useValue(mockMailService)
        .overrideProvider(RedisService)
        .useValue(mockRedisService)
        // .overrideProvider(RedisService)
        // .overrideProvider(MailService)
        // .useValue(mockMailService)
        // .overrideProvider(RedisService)
        // .useValue(mockRedisService)

        .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    httpServer = app.getHttpServer();

    prisma = app.get(PrismaService);
}, 10000);

afterAll(async () => {
    // await Promise.all([
    //     prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`,
    //     app.get(RedisService).onModuleDestroy(),
    //     new Promise((resolve) => httpServer.close(resolve)),
    //     app.close(),
    // ]);
    const prisma = app.get(PrismaService);

    const redisService = app.get(RedisService);
    await redisService.onModuleDestroy();

    await prisma.$disconnect();
    await clearDatabase(prisma);

    await app.close();
    console.log('[Test] Clean shutdown complete');

    await new Promise((resolve) => setTimeout(resolve, 500));
});
