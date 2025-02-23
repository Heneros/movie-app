import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { clearDatabase } from '../helpers/db-helper';
import { faker } from '@faker-js/faker';

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
    userToken = responseUser.body.newRefreshToken;
  });
  /////////////Success
  it('Should Update Movie  - Success', async () => {
    const response = await request(app.getHttpServer())
      .post(`/movie`)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'James Bro',
        category: 'Horror',
        preview: 'preview_url',
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
        description: 'not wrong',
        actorsList: ['Keanu'],
      })
      .expect(200);

    expect(responseGet.body).toMatchObject({
      title: 'Updated',
      published: true,
      description: 'not wrong',
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
        title: 'James Bro',
        category: 'Horror',
        preview: 'preview_url',
        description: 'Horror movie about missing in forest',
      })
      .expect(201);
    movieId = response.body.id;
     await request(app.getHttpServer())
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
          'title must be longer than or equal to 5 characters',
          'title should not be empty',
          'description should not be empty',
          'preview should not be empty',
          'each value in actorsList must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });

    //    console.log(responseGet.body);
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
