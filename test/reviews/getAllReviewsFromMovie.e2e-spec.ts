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
        movie = await createMovie();
        // for (let i = 0; i < 12; i++) {

        //     createdReview.push(res.body);
        // }

        for (let i = 0; i < 12; i++) {
            const res = await request(app.getHttpServer())
                .post(`/movie/${movie.id}/review`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(review)
                .expect(201);

            createdReview.push(res.body);
        }

        const response = await request(app.getHttpServer())
            .get(`/movie/${movie.id}/review`)
            .expect(200);

        // .expect(200);

        // console.log(createdReview[0]);

        expect(response.body.limit).toBeGreaterThanOrEqual(5);
        expect(response.body.reviews).toBeDefined();
        expect(response.body.total).toBe(12);
    });

    it("Should Fail if you don't have access to reviews -  Fail", async () => {
        const createdReview = [];
        review = await rawDataReview();
        movie = await createMovie();
        // for (let i = 0; i < 12; i++) {

        //     createdReview.push(res.body);
        // }

        const response = await request(app.getHttpServer())
            .get(`/movie/${movie.id}/review`)
            .expect(200);

        expect(response.body.limit).toBeGreaterThanOrEqual(0);
        expect(response.body.reviews).toMatchObject([]);
        expect(response.body.total).toBe(0);
    });

    afterEach(async () => {
        await clearDatabase(prisma);

        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
