import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { clearDatabase } from '../helpers/db-helper';
import { faker } from '@faker-js/faker';

export const createReview = async () => {
    let prisma = app.get(PrismaService);
    const defaultMovie = {
        title: faker.internet.displayName(),
        category: 'Horror',
        year: 1233,
        actorsList: ['James Woods'],
        description: 'Horror movie about missing in forest',
    };

    let testUser = await prisma.user.create({
        data: {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            roles: ['Admin', 'User'],
            password: await bcrypt.hash('password123', 10),
            isEmailVerified: true,
        },
    });

    let userToken = jwt.sign(
        { id: testUser.id, name: testUser.name, roles: testUser.roles },
        process.env.JWT_SECRET!,
        { expiresIn: '31d' },
    );

    const response = await request(app.getHttpServer())
        .post('/movie')
        .set('Authorization', `Bearer ${userToken} `)
        .send(defaultMovie)
        .expect(201);

    expect(response.body).toMatchObject({
        title: response.body.title,
        category: 'Horror',
        actorsList: ['James Woods'],
        description: 'Horror movie about missing in forest',
    });

    const review = await request(app.getHttpServer())
        .post(`/movie/${response.body.id}/review`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ positive: true, review: 'Test Review' });
        

    const reviewSingle = await request(app.getHttpServer()).get(
        `/movie/${review.body.id}/singleReview`,
    );

    return reviewSingle;
};

export const rawDataReview = async () => {
    const data = {
        positive: true,
        review: faker.lorem.words({ min: 3, max: 12 }),
    };
    return data;
};
