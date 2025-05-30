import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';
import jwt from 'jsonwebtoken';
import { createMovie } from '../../helpers/createMovie';

describe('Movies  Search -METHOD  Get  /movie/search?title= movies(e2e)', () => {
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

        // console.log('23123', movie);

        userToken = jwt.sign(
            { id: testUser.id, name: testUser.name, roles: testUser.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
    });

    //////////////////////////Success
    it('Should Search All Movie method GET  - Success', async () => {
        const responseMovie = await request(app.getHttpServer())
            .get(`/movie/search`)
            .query({
                title: movie.title,
            })
            .expect(200);
        // console.log(responseMovie.body);

        expect(responseMovie.body).toMatchObject([{ title: movie.title }]);
    });

    //////////////////////////Fail
    it('Should GET Search Wrong Movie Title  -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .get(`/movie/search`)
            .query({
                title: 'Wrong movie1',
            })
            .expect(400);

        expect(response.body).toMatchObject({
            message: 'Failed to search movies',
            error: 'Bad Request',
            statusCode: 400,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
