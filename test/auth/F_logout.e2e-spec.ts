import express, { Request, Response } from 'express';
import session from 'express-session';
import { PrismaService } from '@/prisma/prisma.service';

import { app } from '../setup';

import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { LogoutCommand } from '@/auth/commands';
import { CustomRequest } from '@/types/cus-request';
import { clearDatabase } from '../helpers/db-helper';
import { LogoutHandler } from '@/auth/handlers';

describe('Auth - Logout (e2e) /auth/logout', () => {
    let prisma: PrismaService;
    let testUser;
    let resetToken;

    let logoutService: LogoutCommand;
    let mockRequest: CustomRequest;
    let mockResponse: Response;

    beforeEach(async () => {
        prisma = app.get(PrismaService);
        logoutService = new LogoutCommand(mockRequest, mockResponse);

        // mockRequest = {
        //     session: {
        //         destroy: jest.fn().mockImplementation((fn) => fn(false)),
        //         // destroy: jest.fn().mockImplementation((callback) => callback(null)),
        //     } as any as session.Session,
        // };

        // mockResponse = {
        //     clearCookie: jest.fn().mockReturnThis(),
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn().mockReturnThis(),
        // };

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });

        resetToken = await prisma.verifyResetToken.create({
            data: {
                userId: testUser.id,
                token: 'valid-reset-token',
                expiresAt: new Date(Date.now() + 1000 * 60 * 10),
            },
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
    });

    it('should log out successfully (e2e)', async () => {
        const destroyMock = jest.fn((callback) => callback(null));

        mockRequest = {
            session: {
                destroy: destroyMock,
            },
        } as unknown as CustomRequest;

        mockResponse = {
            clearCookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        const handler = new LogoutHandler({ update: jest.fn() } as any);
        const result = await handler.execute(
            new LogoutCommand(mockRequest, mockResponse),
        );

        expect(destroyMock).toHaveBeenCalled();
        expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwtMovie');
        expect(mockResponse.clearCookie).toHaveBeenCalledWith('connect.sid');
        expect(result).toBe('Logged out successfully');

    });
});
