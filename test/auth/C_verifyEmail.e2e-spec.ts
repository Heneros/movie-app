import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

// dir: path.join(__dirname, 'templates'),

import { app } from '../setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { tempRegisterDate } from '@/data/defaultData';

const testUserFile = path.join(__dirname, './data/testUser.json');
describe('Auth - Verify Email (e2e)', () => {
  let prisma: PrismaService;
  let user;
  let testUser;

  beforeEach(async () => {
    prisma = app.get(PrismaService);
    // user = await JSON.parse(fs.readFileSync(testUserFile, 'utf8'));
    // testUser = await prisma.user.findFirst({
    //   where: { id: Number(user.id) },
    // });
    // console.log(testUser);
    // expect(testUser).toBeDefined();
    // expect(testUser.email).toBe(user.email);
  });

  it('should verify email successfully', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const verificationToken = await prisma.verifyResetToken.create({
      data: {
        token: 'random-token',
        userId: user.id,
        expiresAt: tempRegisterDate,
      },
    });
    expect(user).toBeDefined();

    // const verifyData: VerifyEmailDto = {
    //   userId: testUser.id,
    //   emailToken: user.token,
    // };

    const response = await request(app.getHttpServer())
      .get(
        `/auth/verify/${verificationToken.token}/${verificationToken.userId}`,
      )
      .expect(200);
    // console.log(response.body);
    expect(response.body).toEqual({ message: 'Your email is verified!' });
  });
});
