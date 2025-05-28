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

describe('Movies - Get all favorite movies by user(e2e) METHOD GET movie/userID/allFavorites', () => {
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

        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

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
        const moviePromises = [];
        const favoritePromises = [];

        for (let i = 0; i < 9; i++) {
            moviePromises.push(
                request(app.getHttpServer())
                    .post(`/movie`)
                    .set('Authorization', `Bearer ${userToken} `)
                    .send({
                        title: faker.internet.displayName(),
                        category: 'Horror',
                        year: 1999,
                        actorsList: ['James Woods'],
                        description: `Horror movie about missing in forest ${i}`,
                    })
                    .expect(201),
            );
            favoritePromises.push(
                request(app.getHttpServer())
                    .post(`/movie/${movie.id}/addFav`)
                    .set('Authorization', `Bearer ${userToken} `)
                    .send(user),
            );
        }
        await Promise.all(moviePromises);
        await Promise.all(favoritePromises);

        const response = await request(app.getHttpServer())
            .get(`/movie/${user.id}/allFavorites`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        console.log(response.body);

        // expect(response.body).toMatchObject([
        //     {
        //         id: expect.any(Number),
        //         title: expect.any(String),
        //         description: expect.any(String),
        //         category: expect.any(String),
        //     },
        // ]);
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
            .get(`/movie/${user.id}/allFavorites`)
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

        console.log(response.body);

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
