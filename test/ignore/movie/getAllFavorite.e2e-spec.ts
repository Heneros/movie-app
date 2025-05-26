import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Get all favorite movies by user(e2e)', () => {
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
    });

    /////////////Success
    it('Should Get all Movies favorite  - Success', async () => {
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
            .post(`/movie/${movieId}/rateMovie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id })
            .expect(201);

        const responseGet = await request(app.getHttpServer())
            .get(`/movie/${testUser.id}/allFavorites`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id })
            .expect(200);
        // console.log(responseGet.body);
        // console.log(responseGet.body);

        expect(responseGet.body).toMatchObject([
            {
                title: 'James Bro',
                description: 'Horror movie about missing in forest',
                category: 'Horror',
                preview: 'preview_url',
                published: false,
            },
        ]);
    });

    /////////////Fail
    // it('Should Fail add Same Movie to favorite -  Fail', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post(`/movie`)
    //     .set('Authorization', `Bearer ${userToken}`)
    //     .set('Content-Type', 'application/json')
    //     .send({
    //       title: 'James Bro',
    //       category: 'Horror',
    //       preview: 'preview_url',
    //       description: 'Horror movie about missing in forest',
    //     })
    //     .expect(201);

    //   movieId = response.body.id;

    //   await request(app.getHttpServer())
    //     .post(`/movie/${movieId}/addFav`)
    //     .set('Authorization', `Bearer ${userToken}`)
    //     .set('Content-Type', 'application/json')
    //     .send({ userId: testUser.id })
    //     .expect(201);

    //   const responseGet = await request(app.getHttpServer())
    //     .post(`/movie/${movieId}/addFav`)
    //     .set('Authorization', `Bearer ${userToken}`)
    //     .set('Content-Type', 'application/json')
    //     .send({ userId: testUser.id });

    //   // console.log(responseGet.body);

    //   expect(responseGet.body).toMatchObject({
    //     message: 'Movie Exist in Favorites list',
    //     error: 'Bad Request',
    //     statusCode: 400,
    //   });

    //   //    console.log(responseGet.body);
    // });

    it("Should Fail if you don't have access  to favorite another user -  Fail", async () => {
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
            .get(`/movie/${testUser.id}/allFavorites`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .set('Content-Type', 'application/json')
            .send({ userId: testUser.id })
            .expect(403);

        // console.log(responseGet.body);

        expect(responseGet.body).toMatchObject({
            message: 'You are not authorized to update this profile',
            error: 'Forbidden',
            statusCode: 403,
        });
    });
    //   //    console.log(responseGet.body);
    // });
    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
