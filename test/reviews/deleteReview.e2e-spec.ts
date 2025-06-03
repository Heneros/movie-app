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

describe('Movies - Delete review from movie METHOD DELETE movie/:id/review', () => {
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
    it('Should Delete  Review from movie - Success', async () => {
        review = await createReview();
        movie = await createMovie();

        const response = await request(app.getHttpServer())
            .delete(`/movie/${review.body.id}/review/${review.body.auId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        //   console.log(response.text);
        // console.log(review.body);
        // expect(response.body.limit).toBeGreaterThanOrEqual(5);
        // expect(response.body).toBeDefined();
        expect(response.text).toMatch(`Review was deleted ${review.body.id}`);
    });

    it('Should Fail 404 -  Fail', async () => {
        review = await createReview();
        movie = await createMovie();

        const response = await request(app.getHttpServer())
            .delete(`/movie/0/review/0`)
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
