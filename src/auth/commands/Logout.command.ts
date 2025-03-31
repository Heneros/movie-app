import { CustomRequest } from '@/types/cus-request';
import { ICommand } from '@nestjs/cqrs';
import express, { Request, Response } from 'express';

export class LogoutCommand implements ICommand {
    constructor(
        public readonly req: CustomRequest,
        public readonly res: Response,
    ) {}
}
