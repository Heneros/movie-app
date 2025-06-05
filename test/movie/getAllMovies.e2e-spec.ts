import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import { faker } from '@faker-js/faker/.';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

describe('Movies - Get All movies(e2e)', () => {
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

    afterEach(async () => {
        await clearDatabase(prisma);
    });
    it('Should GET All Movie GET - Success', async () => {
        const moviePromises = [];
        for (let i = 0; i < 9; i++) {
            moviePromises.push(
                request(app.getHttpServer())
                    .post(`/movie`)
                    .set('Authorization', `Bearer ${userToken} `)
                    .send({
                        title: faker.internet.displayName(),
                        category: 'Horror',
                        year: faker.number.int({ min: 1950, max: 2025 }),
                        actorsList: [faker.person.fullName()],
                        description: 'Horror movie about missing in forest',
                    }),
            );
        }
        await Promise.all(moviePromises);
        const responseGet = await request(app.getHttpServer()).get(`/movie`);

        expect(responseGet.body.length).toBe(5);
    });

    it('Should GET All Movie Not Enough Movies -  Fail', async () => {
        const moviePromises = [];
        for (let i = 0; i < 9; i++) {
            moviePromises.push(
                request(app.getHttpServer())
                    .post(`/movie`)
                    .set('Authorization', `Bearer ${userToken} `)
                    .send({
                        title: faker.internet.displayName(),
                        category: 'Horror',
                        year: faker.number.int({ min: 1950, max: 2025 }),
                        actorsList: [faker.person.fullName()],
                        description: 'Horror movie about missing in forest',
                    }),
            );
        }
        await Promise.all(moviePromises);
        const responseGet = await request(app.getHttpServer()).get(
            `/movie?page=2`,
        );
        // console.log(responseGet.body);
        expect(responseGet.body.length).toBeGreaterThanOrEqual(3);
    });

    it('Should Movie GET ALL - Fail', async () => {
        await clearDatabase(prisma);

        await app.get(CACHE_MANAGER).del(`${RedisPrefixEnum.MOVIE}:0`);

        const response = await request(app.getHttpServer()).get(`/movie`);
        // console.log(response.body);
        expect(response.body).toMatchObject({ error: 'Not Found' });
    });
});
