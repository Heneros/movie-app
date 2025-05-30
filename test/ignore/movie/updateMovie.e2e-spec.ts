import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';
import { faker } from '@faker-js/faker/.';

describe('Movies - Update movies(e2e)', () => {
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
                roles: ['Admin', 'Editor'],
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
    /////////////Success
    it('Should Update Movie  - Success', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: faker.internet.displayName(),
                category: faker.lorem.word(),
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        movieId = response.body.id;

        const responseGet = await request(app.getHttpServer())
            .patch(`/movie/${movieId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: 'Updated',
                published: true,
                description: 'not wrong test er we rwer test',
                actorsList: ['Keanu'],
            });
        // .expect(200);

        expect(responseGet.body).toMatchObject({
            title: 'Updated',
            published: true,
            description: 'not wrong test er we rwer test',
            actorsList: ['Keanu'],
        });
    });

    /////////////Fail
    it('Should Update Movie -  Fail', async () => {
        const response = await request(app.getHttpServer())
            .post(`/movie`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: faker.internet.displayName(),
                category: faker.lorem.word(),
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            })
            .expect(201);

        movieId = response.body.id;
        const res = await request(app.getHttpServer())
            .patch(`/movie/${movieId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .set('Content-Type', 'application/json')
            .send({
                title: '',
                preview: '',
                description: '',
                actorsList: ['Keanu', true, 123],
            })
            .expect({
                message: [
                    'property preview should not exist',
                    'Name must be between 2 and 30 characters',
                    'title must be longer than or equal to 5 characters',
                    'title should not be empty',
                    'Description must be between 10 and 350 characters',
                    'description should not be empty',
                    'each value in actorsList must be a string',
                ],
                error: 'Bad Request',
                statusCode: 400,
            });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
    });
});
