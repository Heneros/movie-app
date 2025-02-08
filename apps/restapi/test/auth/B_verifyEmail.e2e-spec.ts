import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

// dir: path.join(__dirname, 'templates'),

import { app } from '../setup';
import { VerifyEmailDto } from '../../src/auth/dto/verify-email.dto';

const testUserFile = path.join(__dirname, './data/testUser.json');

describe('Auth - Verify Email (e2e)', () => {
  it('should verify email successfully', async () => {
    const testUser = JSON.parse(fs.readFileSync(testUserFile, 'utf8'));
    console.log(testUser);
    // const verifyData: VerifyEmailDto = {
    //   userId: testUser.id,
    //   emailToken: testUser.token,
    // };

    // const response = await request(app.getHttpServer())
    //   .post('/auth/verify-email')
    //   .send(verifyData)
    //   .expect(200);

    // expect(response.body).toEqual({ message: 'Your email is verified!' });
  });
});
