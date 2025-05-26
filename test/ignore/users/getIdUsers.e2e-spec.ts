import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { app } from '../../setup';
interface Userid {
    id: number;
}

describe('Users - Get Id user(e2e)', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;
    let userId: number;
    const wrongId = 9999999;

    beforeEach(async () => {
        prisma = new PrismaService();

        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'testuser@example.com',
                password: hashedPassword,
                isEmailVerified: true,
            },
        });

        userId = user.id;

        // console.log(userId);

        const responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
        userToken = responseUser.body.refreshToken;
        // console.log(userToken);
    });

    it('Should GET by id user', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        // console.log(response.body);
        // expect(response.body).toHaveProperty('email');
        // expect(response.body).toHaveProperty('email', 'testuser@example.com');
        expect(response.body).toMatchObject({
            id: userId,
            name: 'Test User',
            email: 'testuser@example.com',
            isEmailVerified: true,
        });
        expect(Array.isArray(response.body.refreshToken)).toBe(true);
    });

    it('Should Fail GET by id user', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${wrongId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(400);
        // console.log(response.body);
        expect(response.body).toHaveProperty(
            'message',
            'No user exists with this email',
        );
    });
    afterEach(async () => {
        await prisma.verifyResetToken.deleteMany();
        await prisma.user.deleteMany();
    });
});
