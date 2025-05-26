import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Get movie By Id(e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let userToken;
    let movieId;

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

        const responseUser = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });
        userToken = responseUser.body.refreshToken;
    });

    it('Should GET By id Movie GET - Success', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie/`)
            .set('Authorization', `Bearer ${userToken} `)
            .send({
                title: 'Think Twice?',
                category: 'Horror',
                preview: 'preview_url',
                description: 'Horror movie about missing in forest',
            });

        movieId = response.body.id;

        const responseGet = await request(app.getHttpServer())
            .get(`/movie/${movieId}`)
            //   .set('Authorization', `Bearer ${userToken} `)
            .send();

        expect(responseGet.body).toMatchObject({
            title: 'Think Twice?',
            category: 'Horror',
            preview: 'preview_url',
            description: 'Horror movie about missing in forest',
        });
        // console.log(response.body);
    });

    it('Should Create Movie GET - Fail', async () => {
        const response = await request(app.getHttpServer())
            .get(`/movie/1232313`)
            .send()
            .expect(404);

        // console.log(response.body);
        expect(response.body).toHaveProperty(
            'message',
            'movie with 1232313 does not exist.',
        );
        expect(response.status).toBe(404);
    });
    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
