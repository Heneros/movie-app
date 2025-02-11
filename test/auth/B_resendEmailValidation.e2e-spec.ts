import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { app, mockMailService } from '../setup';

import { PrismaService } from '../../src/src/prisma/prisma.service';

describe('Auth - Resend Email (e2e)', () => {
  let prisma: PrismaService;
  let testUser;
  let resetToken;
  beforeEach(async () => {
    prisma = app.get(PrismaService);

    testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        isEmailVerified: false,
      },
    });

    resetToken = await prisma.verifyResetToken.create({
      data: {
        userId: testUser.id,
        token: 'valid-reset-token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      },
    });
  });
  afterEach(async () => {
    await prisma.verifyResetToken.deleteMany();
    await prisma.user.deleteMany();
  });
  it('Resend email (e2e) successfully', async () => {
    const emailUser = { email: testUser.email };

    const response = await request(app.getHttpServer())
      .post('/auth/resend_email_token')
      .send(emailUser);

    expect(response.body).toHaveProperty(
      'message',
      'Email was successfully sent',
    );

    expect(mockMailService.resendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: testUser.email }),
      'Welcome to Movie App! Confirm your Email ',
      './confirmation',
      expect.objectContaining({
        name: testUser.name,
        link: expect.stringContaining('/auth/verify/'),
      }),
    );

    // console.log(response.body);
  });

  it('should throw NotFoundException if user not found', async () => {
    const resendEmailDto = {
      email: 'nonexistent@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/resend_email_token')
      .send(resendEmailDto);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
    // console.log(response.body);
  });
  it('should throw BadRequestException if user already verified', async () => {
    await prisma.user.update({
      where: { email: testUser.email },
      data: { isEmailVerified: true },
    });

    const resendEmailDto = {
      email: testUser.email,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/resend_email_token')
      .send(resendEmailDto);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already verified');
    // console.log(response.body);
  });
});
