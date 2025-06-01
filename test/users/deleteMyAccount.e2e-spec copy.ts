import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { app } from '../setup';
import { clearDatabase } from '../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { rawUserData } from '../helpers/createUser';
import { faker } from '@faker-js/faker/.';
import { roundsOfHashing } from '@/data/defaultData';

describe('Users - DELETE my account (e2e) DELETE user/:userId/myaccount', () => {
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

    it('Should Delete accint ', async () => {
        // console.log(userTest);

        // const userId = responseUser._body.id;

        await request(app.getHttpServer())
            .delete(`/users/${userTest.id}/myaccount`)
            .set('Authorization', `Bearer ${userToken}`);
        //  .set('Content-Type', 'application/json');
        // .expect(200);

        //   console.log(testRes.body);

        const user = await prisma.user.findUnique({
            where: {
                id: userTest.id,
            },
        });

        expect(user).toBeNull();
    });

    it('Should Fail DELETE if try delete admin account ', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${adminUser.id}/myaccount`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(403);

        //   console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'Admin cannot delete their own account',
            // error: 'Forbidden',
            // statusCode: 403,
        });
    });

    it('Should Fail DELETE if try delete user account if you not owner', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${userTest.id}/myaccount`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(403);

        // console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'You are not authorized to have access to this profile',
            error: 'Forbidden',
            statusCode: 403,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.USERS}:0`);
    });
});
