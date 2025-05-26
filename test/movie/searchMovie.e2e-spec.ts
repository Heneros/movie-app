import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import jwt from 'jsonwebtoken';
import { createMovie } from '../helpers/createMovie';

describe('Movies  Search - Get  movies(e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movie;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                roles: ['Admin', 'User'],
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });

        movie = await createMovie();

        console.log('23123', movie);
        userToken = jwt.sign(
            { id: testUser.id, name: testUser.name, roles: testUser.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
    });

    //////////////////////////Success
    it('Should Search All Movie method GET  - Success', async () => {
        const responseMovie = await request(app.getHttpServer())
            .get(`/movie/search?title=${movie.title}`)
            .query({
                title: movie.title,
                page: 1,
            })
            .expect(200);
        console.log(responseMovie.body);

        expect(responseMovie.body).toMatchObject([{ title: movie.title }]);
    });

    //////////////////////////Fail
    it('Should GET Search Movie  -  Fail', async () => {
        await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken} `)
            .send({
                title: 'Title movie',
                category: 'Horror',
                preview: 'preview_url',
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        await request(app.getHttpServer())
            .get(`/movie/search`)
            .query({
                title: 'Wrong movie1',
            })
            .expect({
                message: "Movies with title 'Wrong movie1' do not exist.",
                error: 'Not Found',
                statusCode: 404,
            });

        // console.log(responseMovie.body);
        // expect(responseMovie.body).toMatchObject([{ title: 'Title movie' }]);
    });

    // it('Should Movie GET ALL - Fail', async () => {
    //   const response = await request(app.getHttpServer()).get(`/movie`);
    //   console.log(response.body);
    //   expect(response.body).toMatchObject({ error: 'Not Found' });
    // });

    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
