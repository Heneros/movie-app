import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import { faker } from '@faker-js/faker/.';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

describe('Movies - Remove from favorite movies(e2e) METHOD POST /movie/:userId/removeFav/:movieId ', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;
    let userId;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                roles: ['Admin', 'Editor', 'User'],
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });
        userId = testUser.id;

        // console.log(testUser);
        const responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });
        userToken = responseUser.body.refreshToken;
    });

    /////////////Success
    it('Should method Delete. Delete  Movie from favorite  - Success', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: faker.internet.displayName(),
                category: 'Horror',
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        movieId = response.body.id;

        await request(app.getHttpServer())
            .post(`/movie/${movieId}/addFav`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            // .send({ movieId: movieId })
            .send({ userId: testUser.id })
            .expect(201);

        // console.log(qewe.body);

        const responseGetSecond = await request(app.getHttpServer())
            .delete(`/movie/${userId}/removeFav/${movieId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ movieId })
            .expect(200);

        //   console.log(responseGetSecond.body);

        // console.log(`/movie/${userId}/removeFav/${movieId}`);

        expect(responseGetSecond.body).toMatchObject({
            userId: testUser.id,
            movieId: movieId,
        });
    });

    /////////////Fail
    it('Should Fail remove Same Movie to favorite -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: faker.internet.displayName(),
                category: 'Horror',
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        movieId = response.body.id;

        await request(app.getHttpServer())
            .post(`/movie/${movieId}/addFav`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id })
            .expect(201);

        const responseGet = await request(app.getHttpServer())
            .post(`/movie/${movieId}/addFav`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id });

        // console.log(responseGet.body);

        expect(responseGet.body).toMatchObject({
            message: 'Movie already exists in favorites',
            error: 'Bad Request',
            statusCode: 400,
        });

        //    console.log(responseGet.body);
    });

    afterEach(async () => {
        await clearDatabase(prisma);

        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
