import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Add to favorite movies(e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;
    let userId;
    let movie;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                roles: ['Admin', 'Editor'],
                password: await bcrypt.hash('password123', 10),
                provider: 'email',
                isEmailVerified: true,
            },
        });
        userToken = jwt.sign(
            { id: testUser.id, name: testUser.name, roles: testUser.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );

        // console.log(userToken);
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
                year: 1999,
                actorsList: ['James Woods'],
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

    it('Should Fail add Same Movie to favorite -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: `James Bro-${Date.now()}`,
                category: 'Horror',
                year: 1999,
                actorsList: ['James Woods'],

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
            message: 'Movie already exists in favorites',
            error: 'Bad Request',
            statusCode: 400,
        });
    });

    it('Should Fail add Same Movie to favorite -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: `James Bro-${Date.now()}`,
                category: 'Horror',
                year: 1999,
                actorsList: ['James Woods'],
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
            message: 'Movie already exists in favorites',
            error: 'Bad Request',
            statusCode: 400,
        });
    });
    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
