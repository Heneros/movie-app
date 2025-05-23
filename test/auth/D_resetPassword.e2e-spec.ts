import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { app, httpServer, mockMailService } from '../setup';

import { PrismaService } from '@/prisma/prisma.service';
import { tempRegisterDate } from '@/data/defaultData';

describe('Auth - Reset password (e2e)', () => {
    let prisma: PrismaService;
    let testUser;
    let resetToken;

    beforeEach(async () => {
        prisma = app.get(PrismaService);

        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: `test${Date.now()}-@example.com`,
                password: await bcrypt.hash('password123', 10),
                isEmailVerified: true,
            },
        });

        resetToken = await prisma.verifyResetToken.create({
            data: {
                userId: testUser.id,
                token: 'valid-reset-token',
                expiresAt: new Date(Date.now() + 3600 * 5000),
                createdAt: new Date().toISOString(),
            },
        });
    }, 30000);
    afterEach(async () => {
        await prisma.verifyResetToken.deleteMany();
        await prisma.user.deleteMany();
    });

    it('Reset password (e2e) successfully', async () => {
        const resetPasswordDto = {
            userId: testUser.id,
            password: 'newPassword123',
            passwordConfirm: 'newPassword123',
        };

        // resetToken = await prisma.verifyResetToken.create({
        //     data: {
        //         userId: testUser.id,
        //         token: 'valid-reset-token',
        //         expiresAt: new Date(Date.now() + 3600 * 5000),
        //         createdAt: new Date().toISOString(),
        //     },
        // });

        const response = await request(httpServer)
            .post(
                `/auth/reset_password?emailToken=${resetToken.token}&userId=${testUser.id}`,
            )
            .send({
                password: 'newPassword123',
                passwordConfirm: 'newPassword123',
            });

        console.log('1232323', response.body);
        expect(response.body.message).toBe(
            'Your password was reset successfully!',
        );

        const updatedUser = await prisma.user.findUnique({
            where: { id: testUser.id },
        });

        const isPasswordCorrect = await bcrypt.compare(
            resetPasswordDto.password,
            updatedUser.password,
        );

        expect(isPasswordCorrect).toBe(true);
        expect(mockMailService.resendEmail).toHaveBeenCalled();
    });

    // it('should fail if passwords do not match', async () => {
    //     const resetPasswordDto = {
    //         userId: testUser.id,
    //         password: 'newPassword123',
    //         passwordConfirm: 'differentPassword123',
    //     };
    //     const response = await request(app.getHttpServer())
    //         .post('/auth/reset_password')
    //         .send(resetPasswordDto)
    //         .expect(400);

    //     expect(response.body.message).toBe('Password do not match');
    // });

    // it('should fail if token is expired', async () => {
    //     await prisma.verifyResetToken.update({
    //         where: { userId: testUser.id },
    //         data: {
    //             expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    //         },
    //     });

    //     const resetPasswordDto = {
    //         userId: testUser.id,
    //         password: 'newPassword123',
    //         passwordConfirm: 'newPassword123',
    //     };

    //     const response = await request(app.getHttpServer())
    //         .post('/auth/reset_password')
    //         .send(resetPasswordDto)
    //         .expect(400);

    //     expect(response.body.message).toBe(
    //         'Your token is either invalid or expired. Try resetting your password again',
    //     );
    // });
    // it('should fail if user does not exist', async () => {
    //     const resetPasswordDto = {
    //         userId: 1e9999,
    //         password: 'newPassword123',
    //         passwordConfirm: 'newPassword123',
    //     };
    //     // console.log(resetPasswordDto.userId);

    //     await request(app.getHttpServer())
    //         .post('/auth/reset_password')
    //         .send(resetPasswordDto)
    //         .expect(400);
    // });
});
