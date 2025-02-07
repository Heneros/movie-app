import * as request from 'supertest';
import { app } from '../setup';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Auth - Register (e2e)', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = app.get(PrismaService);
    // await prisma.verifyResetToken.deleteMany({});
    // await prisma.user.deleteMany({});
  });

  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);

    const verificationToken = await prisma.verifyResetToken.findFirst({
      where: { userId: user.id },
    });
    expect(verificationToken).toBeDefined();
  });

  it('Should throw an error if user already existing', async () => {
    const userData = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toEqual({
      message: 'User already exists with this email',
      error: 'Try another email',
      statusCode: 400,
    });
  });

  it("Should throw an error if passwords don't match ", async () => {
    const userData = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'wrongpassword123',
      passwordConfirm: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toEqual({
      message: 'Confirm password.',
      error: 'Check the passwords you provided.',
      statusCode: 400,
    });
  });
});
