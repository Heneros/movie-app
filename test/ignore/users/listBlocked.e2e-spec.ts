import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { app } from '../../setup';
import { clearDatabase } from '../../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { rawUserData } from '../../helpers/createUser';
import { faker } from '@faker-js/faker/.';

describe('Users - Get All users(e2e) GET user/blocked-list/', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;

    beforeEach(async () => {
        await clearDatabase(prisma);

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
        adminToken = response.body.refreshToken;
        userToken = responseUser.body.refreshToken;
        // console.log(userToken);
    });

    it('Should GET all blocked users', async () => {
        for (let i = 0; i < 12; i++) {
            await prisma.user.create({
                data: {
                    name: faker.internet.displayName(),
                    email: faker.internet.email(),
                    roles: ['User'],
                    password: await bcrypt.hash('password123', 10),
                    isEmailVerified: true,
                    blocked: true,
                },
            });
        }
        const response = await request(app.getHttpServer())
            .get('/users/blocked-list')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.length).toBeLessThanOrEqual(5);
        expect(response.body[0]).toMatchObject({
            blocked: expect.any(Boolean),
        });

        // console.log(response.body);
    });

    it('Should Fail GET all blocked users if you not admin ,if user have role admin', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/blocked-list')
            .set('Authorization', `Bearer ${userToken}`);
        // .expect(403);

        expect(response.body).toHaveProperty('message', 'Forbidden resource');
    });

    it('Should Fail GET all blocked users', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/blocked-list')
            .set('Authorization', `Bearer ${adminToken}`);
        // .expect(403);
        console.log(response.body);
        // expect(response.body).toHaveProperty('message', 'Forbidden resource');
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.USERS}:0`);
    });
});
