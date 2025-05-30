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

describe('Users - Update user  profile (e2e) PUT user/:userId', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;
    let responseUser;
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

    it('Should update profile  ', async () => {
        const data = {
            name: 'James Franko',
            email: 'test56@example.com',
            password: 'asdasdweewqe',
        };
        if (data.password) {
            data.password = await bcrypt.hash(data.password, roundsOfHashing);
        }

        // console.log(data.password);
        ////////////  data.password = await bcrypt.hash(data.password, roundsOfHashing);
        const response = await request(app.getHttpServer())
            .put(`/users/${responseUser.body.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send(data);
        // .expect(200);
        // console.log(response.body);
        // expect(response.body.length).toBeLessThanOrEqual(5);
        expect(response.body).toBeDefined();
        expect(response.body.name).toEqual(data.name);
        expect(response.body.email).toEqual(data.email);
        // expect(response.body.password).toEqual(data.password);

        const updatedUser = await prisma.user.findUnique({
            where: {
                id: response.body.id,
            },
        });

        // console.log(updatedUser);
        const match = await bcrypt.compare(
            data.password,
            updatedUser!.password,
        );
        //   console.log(match);
        expect(match).toBe(true);
    });

    it('Should Fail PUT if wrong fields submitted', async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${responseUser.body.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                test: 'qw',
            });
        //     console.log(response.body);

        expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    it('Should Fail PUT if you not owner', async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${responseUser.body.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .set('Content-Type', 'application/json')
            .expect(403);
        // .send({
        //     test: 'qw',
        // });
        console.log(response.body);

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
