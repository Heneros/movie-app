import express, { Request, Response } from 'express';
import session from 'express-session';
import { PrismaService } from '@/prisma/prisma.service';

import { app } from '../setup';
import { LogoutAuthService } from '@/auth/services/logout.service';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

describe('Auth - Logout (e2e)', () => {
  let prisma: PrismaService;
  let testUser;
  let resetToken;

  let logoutService: LogoutAuthService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    prisma = app.get(PrismaService);
    logoutService = new LogoutAuthService();

    mockRequest = {
      session: {
        destroy: jest.fn().mockImplementation((fn) => fn(false)),
        // destroy: jest.fn().mockImplementation((callback) => callback(null)),
      } as any as session.Session,
    };

    mockResponse = {
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

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

  it('should log out successfully (e2e)', async () => {
    await logoutService.logout(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwtMovie');
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('connect.sid');
    // expect(mockResponse.clearCookie).toHaveBeenCalledWith('connect.sid');
    expect(mockRequest.session?.destroy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Logged out successfully',
    });

    // const loginUserDto = {
    //   email: testUser.email,
    //   password: 'password123',
    // };
    // const loginResponse = await request(app.getHttpServer())
    //   .post('/auth/login')
    //   .send({ email: 'test@example.com', password: 'password123' });

    // const cookies = loginResponse.headers['set-cookie'];
    // expect(cookies).toBeDefined();

    // const response = await request(app.getHttpServer())
    //   .post('/auth/logout')
    //   .set('Cookie', cookies);

    // expect(response.status).toBe(200);
    // expect(response.body).toEqual({ message: 'Logged out successfully' });

    // expect(response.status).toBe(200);

    ///Later addd
    // const protectedResponse = await request(app)
    //   .get('/protected-route')
    //   .set('Cookie', cookies);

    // expect(protectedResponse.status).toBe(401);

    // expect(response.body).toHaveProperty('message', 'Login successful');
    // expect(response.body).toHaveProperty('newRefreshToken');
    // expect(response.headers['set-cookie']).toBeDefined();
    // const logoutUserDto = {
    //   email: 'test@example.com',
    //   password: 'password123',
    // };
    // const responseLogout = await request(app.getHttpServer())
    //   .post('/auth/logout')
    //   .set('Cookie', 'jwtMovie')
    //   .send();
    // console.log(responseLogout.body);
    // expect(responseLogout.status).toBe(200);
    // expect(responseLogout.body).toHaveProperty(
    //   'message',
    //   'Logged out successfully',
    // );
  });
});
