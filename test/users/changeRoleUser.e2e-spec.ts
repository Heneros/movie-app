import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

import { app } from '../setup';
interface Userid {
  id: number;
}

describe('Users - Change role to user(e2e)', () => {
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let userId: number;
  const wrongId = 9999999;

  beforeEach(async () => {
    prisma = new PrismaService();

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testadmin@example.com',
        password: await bcrypt.hash('password123', 10),
        isEmailVerified: true,
        roles: ['Admin', 'User'],
      },
    });

    const userTest = await prisma.user.create({
      data: {
        name: 'Test QWerty',
        email: 'test2@example.com',
        password: await bcrypt.hash('password123', 10),
        isEmailVerified: true,
      },
    });

    userId = userTest.id;
    // console.log(userId);

    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'password123',
      });

    const responseUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test2@example.com',
        password: 'password123',
      });
    adminToken = responseAdmin.body.newRefreshToken;
    userToken = responseUser.body.newRefreshToken;

    // console.log(userToken);
  });

  it('Should method Put by id user', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ roles: ['Editor'] })
      .expect(200);

    // console.log(response.body);
    expect(response.body).toMatchObject({
      id: userId,
      name: 'Test QWerty',
      email: 'test2@example.com',
      roles: ['User', 'Editor'],
      isEmailVerified: true,
    });
    // expect(Array.isArray(response.body.refreshToken)).toBe(true);
  });

  it('Should Fail Put method by id user', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
    // console.log(response.body);
    expect(response.body).toHaveProperty('message', 'Forbidden resource');
    expect(response.body).toHaveProperty('statusCode', 403);
  });
  afterEach(async () => {
    await prisma.verifyResetToken.deleteMany();
    await prisma.user.deleteMany();
  });
});
