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

describe('Movies - Get reviews from movie METHOD GET movie/:id/singleReview', () => {
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
    it('Should Get all Reviews from movies - Success', async () => {
        review = await createReview();
        movie = await createMovie();
        const response = await request(app.getHttpServer()).get(
            `/movie/${review.body.id}/singleReview`,
        );
        // .expect(200);

        console.log(response.body);

        // expect(response.body.limit).toBeGreaterThanOrEqual(5);
        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            movieId: expect.any(Number),
            auId: expect.any(Number),
            review: expect.any(String),
            positive: expect.any(Boolean),
        });
    });

    it("Should Fail if you don't have access to reviews -  Fail", async () => {
        review = await createReview();
        movie = await createMovie();

        // const reviewSingle = await request(app.getHttpServer())
        //     .get(`/movie/${movie.id}/review`)
        //     .set('Authorization', `Bearer ${userToken}`)
        //     // .send(review)
        //     .expect(200);
        // console.log(review);
        const response = await request(app.getHttpServer())
            .get(`/movie/0/singleReview`)
            .expect(404);
        // .expect(200);

        //console.log(response.body);
        //
        // expect(response.body.limit).toBeGreaterThanOrEqual(5);
        // expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
            message: 'No review(s) created yet.',
            error: 'Not Found',
            statusCode: 404,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);

        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
