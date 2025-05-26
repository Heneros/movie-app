import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Delete movies(e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;
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
                email: 'testqwerty@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });
        // console.log(testUserNotAdmin);
        const responseUserNotAdmin = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'testqwerty@example.com',
                password: 'password123',
            });

        userTokenNotAdmin = responseUserNotAdmin.body.refreshToken;
    });

    /////////////Success
    it('Should Delete Movie  - Success', async () => {
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
            .delete(`/movie/${movieId}`)
            .set('Authorization', `Bearer ${userToken}`)
            //   .set('Content-Type', 'application/json')
            //   .send({
            //     title: 'Updated',
            //     published: true,
            //     description: 'not wrong',
            //     actorsList: ['Keanu'],
            //   })
            .expect(200);

        const responseSecond = await request(app.getHttpServer())
            .get(`/movie/${movieId}`)
            .set('Content-Type', 'application/json')
            .expect(404);

        expect(responseSecond.body).toMatchObject({
            error: 'Not Found',
            message: `movie with ${movieId} does not exist.`,
            statusCode: 404,
        });
        // expect(responseGet.body).toMatchObject({
        //   title: 'Updated',
        //   published: true,
        //   description: 'not wrong',
        //   actorsList: [''],
        // });
    });

    /////////////Fail
    it('Should Delete Movie Role wrong-  Fail', async () => {
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
            .delete(`/movie/${movieId}`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .set('Content-Type', 'application/json')
            .expect(403);

        const resSecond = await request(app.getHttpServer())
            .get(`/movie/${movieId}`)
            .expect(200);

        expect(resSecond.body).toBeTruthy();
        // console.log(resSecond.body);
    });

    //   it('Should Movie GET ALL - Fail', async () => {
    //     const response = await request(app.getHttpServer()).get(`/movie`);
    //     console.log(response.body);
    //     expect(response.body).toMatchObject({ error: 'Not Found' });
    //   });

    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
