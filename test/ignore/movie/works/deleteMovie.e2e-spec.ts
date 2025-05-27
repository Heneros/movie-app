import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { clearDatabase } from '../../../helpers/db-helper';
import { createMovie } from '../../../helpers/createMovie';
import {
    registerTestNotAdminUser,
    registerTestUser,
} from '../../../helpers/createUser';

describe('Movies - Delete movies(e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;
    let testUserNotAdmin;
    let movie;
    let userTokenNotAdmin;
    let user;

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
        user = await registerTestUser();

        userToken = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
    });

    /////////////Success
    it('Should Delete Movie  - Success', async () => {
        await request(app.getHttpServer())
            .delete(`/movie/${movie.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        const responseSecond = await request(app.getHttpServer())
            .get(`/movie/${movie.id}`)
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(responseSecond.body).toMatchObject({
            error: 'Bad Request',
            message: 'No movie exists with this id',
            statusCode: 400,
        });
    });

    /////////////Fail
    it('Should Delete Movie Role wrong if you not admin Fail', async () => {
        let user = await registerTestNotAdminUser();

        userTokenNotAdmin = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
        await request(app.getHttpServer())
            .delete(`/movie/${movie.id}`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`)
            .set('Content-Type', 'application/json')
            .expect(403);

        const resSecond = await request(app.getHttpServer())
            .get(`/movie/${movie.id}`)
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
