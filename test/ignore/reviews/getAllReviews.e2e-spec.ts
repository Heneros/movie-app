import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { clearDatabase } from '../../helpers/db-helper';
import { createMovie } from '../../helpers/createMovie';
import {
    registerTestNotAdminUser,
    registerTestUser,
} from '../../helpers/createUser';
import { faker } from '@faker-js/faker/.';
import { createReview, rawDataReview } from '../../helpers/createReview';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

describe('Movies - Get all reviews METHOD GET movie/reviewsAll', () => {
    let prisma: PrismaService;
    let userToken;
    let movie;
    let user;
    let userTokenNotAdmin;
    let review;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        movie = await createMovie();
        user = await registerTestUser();

        userToken = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
    });

    /////////////Success
    it('Should Get all Reviews - Success', async () => {
        const createdReview = [];
        review = await rawDataReview();
        for (let i = 0; i < 12; i++) {
            const res = await request(app.getHttpServer())
                .post(`/movie`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: faker.internet.displayName(),
                    category: 'Horror',
                    year: faker.number.int({ min: 1950, max: 2025 }),
                    actorsList: [faker.person.fullName()],
                    description: 'Horror movie about missing in forest',
                })
                .expect(201);

            createdReview.push(res.body);
        }

        for (const singleMovie of createdReview) {
            await request(app.getHttpServer())
                .post(`/movie/${singleMovie.id}/review`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(review)
                .expect(201);
        }
        const response = await request(app.getHttpServer())
            .get(`/movie/reviewsAll`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(response.body.limit).toBeGreaterThanOrEqual(5);

        expect(response.body).toBeDefined();
        expect(response.body.reviews[0]).toMatchObject({
            id: expect.any(Number),
            review: expect.any(String),
            positive: expect.any(Boolean),
        });
    });

    it("Should Fail if you don't have access to reviews -  Fail", async () => {
        const createdReview = [];
        review = await rawDataReview();
        for (let i = 0; i < 12; i++) {
            const res = await request(app.getHttpServer())
                .post(`/movie`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: faker.internet.displayName(),
                    category: 'Horror',
                    year: faker.number.int({ min: 1950, max: 2025 }),
                    actorsList: [faker.person.fullName()],
                    description: 'Horror movie about missing in forest',
                })
                .expect(201);

            createdReview.push(res.body);
        }

        for (const singleMovie of createdReview) {
            await request(app.getHttpServer())
                .post(`/movie/${singleMovie.id}/review`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(review)
                .expect(201);
        }

        let user = await registerTestNotAdminUser();

        userTokenNotAdmin = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );

        const response = await request(app.getHttpServer())
            .get(`/movie/reviewsAll`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .expect(403);

        // console.log(response.body);
        expect(response.body).toMatchObject({
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);

        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
