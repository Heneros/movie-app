import { faker } from '@faker-js/faker/.';
import { PrismaService } from '@/prisma/prisma.service';
import { app } from '../setup';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const rawUserData = async () => {
    const rawUser = {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        roles: ['User'],
        password: await bcrypt.hash('password123', 10),
        isEmailVerified: true,
        isBlocked: true,
    };
    return rawUser;
};

export const registerTestUser = async () => {
    let prisma = app.get(PrismaService);
    let testUser = await prisma.user.create({
        data: {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            roles: ['Admin', 'User'],
            password: await bcrypt.hash('password123', 10),
            isEmailVerified: true,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: testUser.id,
        },
    });

    return user;
};

export const registerTestNotAdminUser = async () => {
    let prisma = app.get(PrismaService);
    let testUser = await prisma.user.create({
        data: {
            name: faker.internet.displayName(),
            email: faker.internet.email(),
            roles: ['User'],
            password: await bcrypt.hash('password123', 10),
            isEmailVerified: true,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: testUser.id,
        },
    });

    return user;
};
