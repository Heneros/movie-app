import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

import { app } from '../setup';

import { PrismaService } from '../../src/prisma/prisma.service';

const testUserFile = path.join(__dirname, './data/testUser.json');

describe('Auth - Reset password (e2e)', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = app.get(PrismaService);
  });

  it(' Reset password (e2e) successfully', async () => {
    
  });
});
