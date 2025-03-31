import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import express, { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/Auth.repository';
import { BadRequestException } from '@nestjs/common';
import { isDevelopment, tempLoginDate } from '@/data/defaultData';
import { LogoutCommand } from '../commands';
import { CustomRequest } from '@/types/cus-request';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(command: LogoutCommand) {
        const { req, res } = command;

        if (!req.session) {
            return res.status(400).json({ message: 'Session not found' });
        }

        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Failed to destroy session' });
            }

            res.clearCookie('jwtMovie');
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    }
}
