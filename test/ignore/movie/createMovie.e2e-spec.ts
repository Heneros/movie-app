import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';

describe('Movies - Create movies(e2e)', () => {
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
        userToken = responseUser.body.newRefreshToken;
    });

    it('Should Create Movie POST - Success', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie/`)
            .set('Authorization', `Bearer ${userToken} `)
            .send({
                title: 'How we do?',
                category: 'Horror',
                preview: 'preview_url',
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        expect(response.body).toMatchObject({
            title: 'How we do?',
            category: 'Horror',
            preview: 'preview_url',
            description: 'Horror movie about missing in forest',
        });
        // console.log(response.body);
    });

    it('Should Create Movie POST - Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie/`)
            .set('Authorization', `Bearer ${userToken} `)
            .send({
                title: '',
                category: '',
                preview: '',
                description: '',
            })
            .expect(400);

        expect(response.body).toMatchObject({
            error: 'Bad Request',
            statusCode: 400,
            message: expect.arrayContaining([
                'title must be longer than or equal to 5 characters',
                'title should not be empty',
                'description should not be empty',
                'preview should not be empty',
                'category should not be empty',
            ]),
        });
        // console.log(response.body);
    });
    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
