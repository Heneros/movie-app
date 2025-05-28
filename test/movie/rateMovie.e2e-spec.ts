import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { faker } from '@faker-js/faker/.';
import { registerTestNotAdminUser } from '../helpers/createUser';
import jwt from 'jsonwebtoken';

describe('Movies -Rate movie by user(e2e) PATCH /movie/:movieID/rateMovie', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;
    let userId;

    let testUserNotAdmin;
    let userTokenNotAdmin;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                roles: ['Editor'],
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });
        // userId = testUser;

        // console.log(testUser);
        const responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });
        userToken = responseUser.body.refreshToken;

        testUserNotAdmin = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'testNotAdmin@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });
        // userId = testUser;

        // console.log(testUser);
        const responseUserNotAdmin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'testNotAdmin@example.com',
                password: 'password123',
            });
        userTokenNotAdmin = responseUserNotAdmin.body.refreshToken;

        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: faker.internet.displayName(),
                category: faker.lorem.word(),
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        // console.log(response.body);
        movieId = response.body.id;
    });

    /////////////Success
    it('Should Rate  Movie - Success', async () => {
        const responseGet = await request(app.getHttpServer())
            .patch(`/movie/${movieId}/rateMovie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ rating: 5 })
            .expect(200);
        // console.log(responseGet.body);

        expect(responseGet.body.avgRating).toBe(5);

        let user = await registerTestNotAdminUser();
        let userTokenNotAdmin = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
        const responseGetSecond = await request(app.getHttpServer())
            .patch(`/movie/${movieId}/rateMovie`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .set('Content-Type', 'application/json')
            .send({ rating: 4 })
            .expect(200);

        expect(responseGetSecond.body.avgRating).toBe(4.5);
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
