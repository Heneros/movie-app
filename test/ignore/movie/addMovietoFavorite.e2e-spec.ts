import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Add to favorite movies(e2e)', () => {
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
        userToken = responseUser.body.newRefreshToken;
    });

    /////////////Success
    it('Should Add Movie to favorite  - Success', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: 'James Bro',
                category: 'Horror',
                preview: 'preview_url',
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        movieId = response.body.id;

        const responseGet = await request(app.getHttpServer())
            .post(`/movie/${movieId}/addFav`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id })
            .expect(201);

        expect(responseGet.body).toMatchObject({
            userId: testUser.id,
            movieId: movieId,
        });
    });

    /////////////Fail
    it('Should Fail add Same Movie to favorite -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: 'James Bro',
                category: 'Horror',
                preview: 'preview_url',
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
            message: 'Movie Exist in Favorites list',
            error: 'Bad Request',
            statusCode: 400,
        });

        //    console.log(responseGet.body);
    });

    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
