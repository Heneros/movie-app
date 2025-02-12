import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

import { app } from '../setup';

describe('Users - Get All users(e2e)', () => {
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    prisma = new PrismaService();

    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testadmin@example.com',
        password: await bcrypt.hash('password123', 10),
        isEmailVerified: true,
        roles: ['Admin', 'User'],
      },
    });

    await prisma.user.createMany({
      data: [
        {
          name: 'Test QWerty',
          email: 'test2@example.com',
          password: await bcrypt.hash('password123', 10),
          isEmailVerified: true,
        },
        {
          name: 'Test QWerty',
          email: 'test56@example.com',
          password: await bcrypt.hash('password123', 10),
          isEmailVerified: true,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'password123',
      });

    const responseUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test56@example.com',
        password: 'password123',
      });
    adminToken = response.body.newRefreshToken;
    userToken = responseUser.body.newRefreshToken;
    // console.log(userToken);
  });

  it('Should GET all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body[0]).toHaveProperty('email');
    // console.log(response.body);
  });

  it('Should Fail GET all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
    expect(response.body).toHaveProperty('message', 'Forbidden resource');
  });

  afterEach(async () => {
    await prisma.verifyResetToken.deleteMany();
    await prisma.user.deleteMany();
  });
});
