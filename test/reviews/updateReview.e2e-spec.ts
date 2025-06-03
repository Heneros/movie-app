import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { clearDatabase } from '../helpers/db-helper';
import { createMovie } from '../helpers/createMovie';
import {
    registerTestNotAdminUser,
    registerTestUser,
} from '../helpers/createUser';
import { faker } from '@faker-js/faker/.';
import { createReview, rawDataReview } from '../helpers/createReview';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

describe('Movies - UPDATE review from movie METHOD UPDATE movie/:id/review/:id', () => {
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
    it('Should UPDATE Review from movie - Success', async () => {
        const movie = await createMovie();

        const reviewData = {
            review: faker.lorem.paragraph(),
            positive: true,
        };

        const createdReview = await request(app.getHttpServer())
            .post(`/movie/${movie.id}/review`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(reviewData)
            .expect(201);

        // console.log(createdReview.body);

        const updatedReviewData = {
            positive: true,
            review: faker.lorem.words({ min: 3, max: 12 }),
        };

        const userId = user.id;
        const movieId = createdReview.body.id;

        const response = await request(app.getHttpServer())
            .put(`/movie/${movieId}/review/user/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updatedReviewData);
        // .expect(200);

        // console.log(response.body);
        expect(response.body).toBeDefined();
        expect(response.body.review).toEqual(updatedReviewData.review);
        expect(response.body.positive).toEqual(updatedReviewData.positive);
    });

    it('Should Fail 404 -  Fail', async () => {
        review = await createReview();
        movie = await createMovie();

        const response = await request(app.getHttpServer())
            .put(`/movie/0/review/0`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(404);

        // console.log(response.body);
        //
        // expect(response.body.limit).toBeGreaterThanOrEqual(5);
        //     expect(response.body).toBeUndefined();
        expect(response.body).toMatchObject({});
    });

    afterEach(async () => {
        await clearDatabase(prisma);

        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
