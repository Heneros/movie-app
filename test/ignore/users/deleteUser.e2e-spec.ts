import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { app } from '../../setup';
import { clearDatabase } from '../../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { rawUserData } from '../../helpers/createUser';
import { faker } from '@faker-js/faker/.';
import { roundsOfHashing } from '@/data/defaultData';

describe('Users - DELETE user profile (e2e) DELETE user/:userId', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;
    let responseUser;
    let userTest;
    let response;
    beforeEach(async () => {
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

        userTest = await prisma.user.create({
            data: {
                name: 'Test QWerty',
                email: 'test2@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });

        response = await request(app.getHttpServer()).post('/auth/login').send({
            email: 'testadmin@example.com',
            password: 'password123',
        });

        responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test56@example.com',
                password: 'password123',
            });
        adminToken = response.body.refreshToken;
        userToken = responseUser.body.refreshToken;
        // console.log(userToken);
    });

    it('Should Delete profile ', async () => {
        //    console.log(userTest);

        await request(app.getHttpServer())
            .delete(`/users/${userTest.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(200);

        const user = await prisma.user.findUnique({
            where: {
                id: userTest.id,
            },
        });

        //console.log(user);

        expect(user).toBeNull();
    });

    it('Should Fail DELETE if user dont have role admin ', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${userTest.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(403);

        expect(response.body).toHaveProperty('message', 'Forbidden resource');
    });

    it('Should Fail DELETE if user not exist', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/0`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(200);

        //    console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'No user found',
            name: 'NotFoundException',
            options: {},
            response: {
                error: 'Not Found',
                message: 'No user found',
                statusCode: 404,
            },
            status: 404,
        });
    });

    it('Should Fail if you admin', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/users/${response.body.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            //.expect(403);
        // .send({
        //     test: 'qw',
        // });
        console.log(res.body.response);
        // console.log(response.body);
        expect(res.body.response).toMatchObject({
            error: 'Forbidden',
            message: 'Admin cannot delete their own account',
            statusCode: 403,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.USERS}:0`);
    });
});
