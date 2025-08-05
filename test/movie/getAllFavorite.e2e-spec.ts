import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { clearDatabase } from '../helpers/db-helper';
import { createMovie } from '../helpers/createMovie';
import {
    registerTestNotAdminUser,
    registerTestUser,
} from '../helpers/createUser';
import { faker } from '@faker-js/faker/.';

describe('Movies - Get all favorite movies by user(e2e) METHOD GET movie/:userID/allFavorites', () => {
    let prisma: PrismaService;
    let userToken;
    let movie;
    let user;

    let userTokenNotAdmin;

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
    it('Should Get all Movies favorite  - Success', async () => {
        await request(app.getHttpServer())
            .post(`/movie/${movie.id}/addFav`)
            .set('Authorization', `Bearer ${userToken}`);

        // console.log(test.body);

        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites`)
            .set('Authorization', `Bearer ${userToken}`);
        // .expect(200);
        // console.log('123', response.body);

        expect(response.body).toMatchObject([
            {
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                category: expect.any(String),
            },
        ]);
    });

    it('Should Get all Movies favorite from second page  - Success', async () => {
        const createdMovies = [];

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

            createdMovies.push(res.body);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));

        for (const singleMovie of createdMovies) {
            await request(app.getHttpServer())
                .post(`/movie/${singleMovie.id}/addFav`)
                .set('Authorization', `Bearer ${userToken}`);
        }
        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body[0]).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            year: expect.any(Number),
            category: expect.any(String),
            published: expect.any(Boolean),
        });
        expect(response.body.length).toBeGreaterThanOrEqual(5);
    });

    it("Should Fail if you don't have access  to favorite another user -  Fail", async () => {
        await request(app.getHttpServer())
            .post(`/movie/${movie.id}/addFav`)
            .set('Authorization', `Bearer ${userToken}`);

        let user = await registerTestNotAdminUser();

        userTokenNotAdmin = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites?page=2`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .expect(200);

        expect(response.body).toEqual([]);
    });

    it('Should Fail if you not logged -  Fail', async () => {
        await request(app.getHttpServer())
            .post(`/movie/${movie.id}/addFav`)
            .set('Authorization', `Bearer ${userToken}`);

        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites`)
            .set('Authorization', ``)
            .expect(401);

        expect(response.body).toMatchObject({
            message: 'No authorization header',
            error: 'Unauthorized',
            statusCode: 401,
        });
    });
    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
