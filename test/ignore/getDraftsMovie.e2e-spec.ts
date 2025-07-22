import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import { faker } from '@faker-js/faker/.';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { registerTestNotAdminUser } from '../helpers/createUser';
import jwt from 'jsonwebtoken';

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
                roles: ['Editor', 'User'],
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

    it('Method GET All Drafts Movie  - Success', async () => {
        const moviePromises = [];
        for (let i = 0; i < 9; i++) {
            moviePromises.push(
                request(app.getHttpServer())
                    .post(`/movie`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        title: faker.internet.displayName(),
                        category: 'Horror',
                        year: faker.number.int({ min: 1950, max: 2025 }),
                        actorsList: [faker.person.fullName()],
                        description: 'Horror movie about missing in forest',
                    })
                    .expect(201),
            );
        }
            await new Promise(resolve => setTimeout(resolve, 500));

        await Promise.all(moviePromises);
        const responseGet = await request(app.getHttpServer())
            .get(`/movie/drafts`)
            .set('Authorization', `Bearer ${userToken}`);
        // console.log(responseGet.body);

        expect(responseGet.body.length).toBeGreaterThanOrEqual(5);
    });

    it('Method GET All Drafts Movie.Should return empty array if you not admin.  -  Fail', async () => {
        const moviePromises = [];
        for (let i = 0; i < 9; i++) {
            moviePromises.push(
                request(app.getHttpServer())
                    .post(`/movie`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                        title: faker.internet.displayName(),
                        category: 'Horror',
                        year: faker.number.int({ min: 1950, max: 2025 }),
                        actorsList: [faker.person.fullName()],
                        description: 'Horror movie about missing in forest',
                    }),
            );
        }
            await new Promise(resolve => setTimeout(resolve, 500));

        // console.log(moviePromises);
        await Promise.all(moviePromises);
        let user = await registerTestNotAdminUser();

        let userTokenNotAdmin = jwt.sign(
            { id: user.id, name: user.name, roles: user.roles },
            process.env.JWT_SECRET!,
            { expiresIn: '31d' },
        );
        const responseGet = await request(app.getHttpServer())
            .get(`/movie/drafts`)
            .set('Authorization', `Bearer ${userTokenNotAdmin}`);

        expect(responseGet.body).toMatchObject({
            message: 'Forbidden resource',
            error: 'Forbidden',
            statusCode: 403,
        });
        //   console.log(responseGet.body);
        //   expect(responseGet.body.length).toBe(0);
    });

    afterEach(async () => {
        const cache = app.get(CACHE_MANAGER);
        await cache.del(`${RedisPrefixEnum.MOVIE}:0`);
        await clearDatabase(prisma);
    });
});
