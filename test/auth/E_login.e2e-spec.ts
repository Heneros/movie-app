import { PrismaService } from '@/prisma/prisma.service';

import { app } from '../setup';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

describe('Auth - Login (e2e)', () => {
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
        isEmailVerified: true,
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
  it('Login successfully (e2e)', async () => {
    const loginUserDto = {
      // id: testUser.id,
      email: testUser.email,
      password: 'password123',
      // passwordConfirm: testUser.password,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto);

    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('newRefreshToken');
    expect(response.headers['set-cookie']).toBeDefined();

    // console.log(response.body);
  });

  it('Wrong email', async () => {
    const loginUserDto = {
      email: 'wrongEmail@gmail.com',
      password: 'password123',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto)
      .expect(400);

    expect(response.body).toHaveProperty(
      'message',
      'No user exists with this email',
    );
  });

  it('Wrong Password', async () => {
    const loginUserDto = {
      email: testUser.email,
      password: 'wrongpassword123',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Invalid password');
  });
});
