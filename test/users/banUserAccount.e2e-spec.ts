import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { app } from '../setup';
import { clearDatabase } from '../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';


describe('Users - BAN user account (e2e) POST user/:userId/ban', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;
    let responseUser;
    let userTest;
    let responseAdmin;
    let adminUser;

    beforeEach(async () => {
        prisma = new PrismaService();

        adminUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'testadmin@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
                roles: ['Admin', 'User'],
            },
        });

        userTest = await prisma.user.create({
            data: {
                name: 'Test QWerty',
                email: 'test2@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
                roles: ['User'],
            },
        });

        responseAdmin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'testadmin@example.com',
                password: 'password123',
            });

        responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test2@example.com',
                password: 'password123',
            });

        adminToken = responseAdmin.body.refreshToken;

        userToken = responseUser.body.refreshToken;
    });

    it('Should Ban user account ', async () => {
        const testRes = await request(app.getHttpServer())
            .put(`/users/${userTest.id}/ban`)
            .set('Authorization', `Bearer ${adminToken}`)
            //  .set('Content-Type', 'application/json');
            .expect(200);

        expect(testRes.text).toBe(`User was banned ${userTest.name}`);

        const user = await prisma.user.findUnique({
            where: {
                id: userTest.id,
            },
        });
        //    console.log(user);

        expect(user.blocked).toBe(true);
    });

    it('Should Fail if try ban admin account ', async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${adminUser.id}/ban`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json');
        // .expect(403);

        //   console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'Admin cannot ban their own account',
        });
    });

    it('Should Fail  if try ban user account if you not exist', async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/1/ban`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(400);

        // console.log(response.body);

        //expect(response.text).toBe(`User was banned ${userTest.name}`);
        expect(response.body).toMatchObject({
            message: 'No user exists with this email',
            error: 'Bad Request',
            statusCode: 400,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.USERS}:0`);
    });
});
