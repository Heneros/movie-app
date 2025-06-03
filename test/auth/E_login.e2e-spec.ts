import { PrismaService } from '@/prisma/prisma.service';

import { app } from '../setup';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

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
            email: 'test@example.com',
            password: 'password123',
            // passwordConfirm: testUser.password,
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginUserDto)
            .expect(201);

        // expect(response.body).toHaveProperty('message', 'Login successful');
        // expect(response.body).toHaveProperty('refreshToken');
        expect(response.headers['set-cookie']).toBeDefined();
        const raw = response.headers['set-cookie'];

        let cookies: string[];
        if (Array.isArray(raw)) {
            cookies = raw;
        } else {
            cookies = [];
        }

        // console.log(cookies);
        expect(cookies.some((c) => c.startsWith('jwtMovie='))).toBe(true);
    });

    it('Wrong email', async () => {
        const loginUserDto = {
            email: 'wrongEmail@gmail.com',
            password: 'password123',
        };
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginUserDto);
        // // .expect(400);
        // console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'No user exists with this email',
            error: 'Bad Request',
            statusCode: 400,
        });
    });

    it('Wrong Password', async () => {
        const loginUserDto = {
            email: 'test@example.com',
            password: 'wrongpassword123',
        };
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginUserDto)
            .expect(400);

        //  console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'Invalid password',
            error: 'Bad Request',
            statusCode: 400,
        });
    });
});
