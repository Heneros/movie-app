import { IQuery } from '@nestjs/cqrs';
import { Response } from 'express';
import { VerifyEmailDto } from './../dto/Verify-email.dto';
import { EmailDto } from '../dto/Resend-email.dto';

export class VerifyEmailQuery implements IQuery {
    constructor(
        public readonly token: string,
        public readonly userId: number,

        public readonly res: Response,
    ) {}
}
