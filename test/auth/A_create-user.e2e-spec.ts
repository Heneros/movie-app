import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

import { app } from '../setup';
import { PrismaService } from '@/prisma/prisma.service';

const testUserFile = path.join(__dirname, './data/testUser.json');

describe('Auth - Register (e2e)', () => {
    let prisma: PrismaService;

    beforeEach(async () => {
        prisma = app.get(PrismaService);
    });

    it('should create a user successfully', async () => {
        const userData = {
            name: 'John Doe',
            email: 'test@example.com',
            password: 'password123',
            passwordConfirm: 'password123',
        };

        const test = await request(app.getHttpServer())
            .post('/auth')
            .send(userData)
            .expect(201);
        // expect(response.status).toBe(201);

        /// console.log(test.body);
        const user = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        expect(user).toBeDefined();
        expect(user.name).toBe(userData.name);

        const verificationToken = await prisma.verifyResetToken.findFirst({
            where: { userId: user.id },
        });

        expect(verificationToken).toBeDefined();

        fs.writeFileSync(
            testUserFile,
            JSON.stringify({
                id: Number(user.id),
                email: user.email,
                token: verificationToken.token,
            }),
            'utf8',
        );
    });

    it('Should throw an error if user already existing', async () => {
        const userData = {
            name: 'John Doe',
            email: 'test@example.com',
            password: 'password123',
            passwordConfirm: 'password123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/')
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
            .post('/auth/')
            .send(userData)
            .expect(400);

        expect(response.body.message).toMatch(/Confirm password/i);
    });
});
