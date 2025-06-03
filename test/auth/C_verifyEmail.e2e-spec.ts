import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

// dir: path.join(__dirname, 'templates'),

import { app } from '../setup';
import { PrismaService } from '@/prisma/prisma.service';
import { tempRegisterDate } from '@/data/defaultData';

const testUserFile = path.join(__dirname, './data/testUser.json');
describe('Auth - Verify Email (e2e)', () => {
    let prisma: PrismaService;
    let user;
    let testUser;

    beforeEach(async () => {
        prisma = app.get(PrismaService);
    });
    afterEach(async () => {
        await prisma.verifyResetToken.deleteMany();
        await prisma.user.deleteMany();
    });

    it('should verify email successfully', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123',
                isEmailVerified: false,
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

        const response = await request(app.getHttpServer())
            .get(
                `/auth/verify/${verificationToken.token}/${verificationToken.userId}`,
            )
            .expect(200);
        // console.log(response.body);
        expect(response.body).toMatchObject({
            id: verificationToken.userId,
            message: 'Your email is verified!',
        });
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
        });
        expect(updatedUser?.isEmailVerified).toBe(true);
    });

    it('should return 400 if token is expired', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Jane Doe',
                email: 'expired@example.com',
                password: 'password123',
                isEmailVerified: false,
            },
        });

        const expiredToken = await prisma.verifyResetToken.create({
            data: {
                token: 'expired-token',
                userId: user.id,
                expiresAt: new Date(Date.now() - 1000 * 60),
            },
        });

        const response = await request(app.getHttpServer())
            .get(`/auth/verify/${expiredToken.token}/${user.id}`)
            .expect(400);

        expect(response.body.message).toBe('Expired token or invalid token');
    });

    it('should return 404 if user not found', async () => {
        const fakeUserId = 'non-existent-user';
        const fakeToken = 'some-token';

        const response = await request(app.getHttpServer())
            .get(`/auth/verify/${fakeToken}/${fakeUserId}`)
            .expect(400);

        // console.log(response.body);
        expect(response.body.message).toBe(
            'Either userId, email or token must be provided',
        );
    });

    it('should return 400 if email already verified', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Verified User',
                email: 'verified@example.com',
                password: 'password123',
                isEmailVerified: true,
            },
        });

        const token = await prisma.verifyResetToken.create({
            data: {
                token: 'token-for-verified',
                userId: user.id,
                expiresAt: tempRegisterDate,
            },
        });

        const response = await request(app.getHttpServer())
            .get(`/auth/verify/${token.token}/${user.id}`)
            .expect(400);

        expect(response.body.message).toBe('Email already verified');
    });
});
