import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../../helpers/db-helper';
import { faker } from '@faker-js/faker/.';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

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
                title: faker.internet.displayName(),
                category: 'Horror',
                year: faker.number.int({ min: 1950, max: 2025 }),
                actorsList: [faker.person.fullName()],
                description: 'Horror movie about missing in forest',
            });

        movieId = response.body.id;

        const responseGet = await request(app.getHttpServer()).get(
            `/movie/${movieId}`,
        );

        expect(responseGet.body).toMatchObject({
            title: expect.any(String),
            category: expect.any(String),
            year: expect.any(Number),
            actorsList: expect.arrayContaining([expect.any(String)]),
            description: expect.any(String),
        });
        // console.log(response.body);
    });

    it('Should Create Movie GET - Fail', async () => {
        const response = await request(app.getHttpServer())
            .get(`/movie/1232313`)
            .send()
            .expect(400);

        // console.log(response.body);
        expect(response.body).toHaveProperty(
            'message',
            'No movie exists with this id',
        );
        expect(response.status).toBe(400);
    });
    afterEach(async () => {
        await clearDatabase(prisma);
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
    });
});
