import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import fs from 'fs';

import { app } from '../../setup';
import { clearDatabase } from '../../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { rawUserData } from '../../helpers/createUser';
import { faker } from '@faker-js/faker/.';
import { roundsOfHashing } from '@/data/defaultData';
import path, { join } from 'node:path';

describe('Users - upload user avatar (e2e) POST user/upload/:userId', () => {
    let prisma: PrismaService;
    let adminToken: string;
    let userToken: string;
    let responseUser;
    let userTest;
    let responseAdmin;
    let adminUser;

    const testImagePath = path.join(__dirname, '../assets/test-avatar.jpg');

    const testImagePathHuge = path.join(__dirname, '../assets/huge.png');

    const testInvalidFile = path.join(__dirname, '../assets/invalid.mp3');

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

        const res = await prisma.avatar.create({
            data: {
                userId: responseUser.body.id,
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/CROP_Tom_Cruise_during_the_2025_Cannes_Film_Festival_03.png/800px-CROP_Tom_Cruise_during_the_2025_Cannes_Film_Festival_03.png',
                publicId: `test-public-id-${Date.now()}`,
            },
        });

        // console.log(res);
    });

    it('Should upload user avatar  Successfully', async () => {
        if (!fs.existsSync(testImagePath)) {
            throw new Error(`Test image not found at: ${testImagePath}`);
        }

        await request(app.getHttpServer())
            .post(`/users/upload/${userTest.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .attach('file', testImagePath)
            .expect(201);

        // console.log('Upload response:', testRes.body);

        const avatar = await prisma.avatar.findUnique({
            where: { userId: userTest.id },
        });
        // console.log('avatar response:', avatar);

        expect(avatar).not.toBeNull();
        expect(avatar.publicId).not.toMatch(/undefined/);
        expect(avatar.userId).toBe(userTest.id);
        expect(avatar.url).toMatch(/^https:\/\/res\.cloudinary\.com\/.+/);
    });

    it('Should Fail if you now owner ', async () => {
        const response = await request(app.getHttpServer())
            .post(`/users/upload/${userTest.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .attach('file', testImagePath)
            .expect(403);

        // console.log(response.body);

        expect(response.body).toMatchObject({
            message: 'You are not authorized to have access to this profile',
            error: 'Forbidden',
            statusCode: 403,
        });
    });

    it('Should Fail  if try upload image you not logged', async () => {
        const response = await request(app.getHttpServer())
            .post(`/users/upload/${userTest.id}`)
            .set('Authorization', `Bearer `)
            .attach('file', testImagePath)
            .expect(401);

        // console.log(response.body);

        // //expect(response.text).toBe(`User was banned ${userTest.name}`);
        expect(response.body).toMatchObject({
            message: 'No token provided',
            error: 'Unauthorized',
            statusCode: 401,
        });
    });

    it('Should Fail if try upload image very huge < 5 mb ', async () => {
        if (!fs.existsSync(testImagePathHuge)) {
            throw new Error(`Test image not found at: ${testImagePathHuge}`);
        }

        const response = await request(app.getHttpServer())
            .post(`/users/upload/${userTest.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .attach('file', testImagePathHuge)
            .expect(413);

        // console.log(response.body);

        // //expect(response.text).toBe(`User was banned ${userTest.name}`);
        expect(response.body).toMatchObject({
            message: 'File too large',
            error: 'Payload Too Large',
            statusCode: 413,
        });
    });

    it('Should Fail if try upload not supported format', async () => {
        if (!fs.existsSync(testInvalidFile)) {
            throw new Error(`Test not found at: ${testInvalidFile}`);
        }

        const response = await request(app.getHttpServer())
            .post(`/users/upload/${userTest.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .attach('file', testInvalidFile);
        // .expect(400);

        // console.log(response.body);

        // // //expect(response.text).toBe(`User was banned ${userTest.name}`);
        expect(response.body).toMatchObject({
            message: 'Invalid image file',
            name: 'Error',
            http_code: 400,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.USERS}:0`);
    });
});
