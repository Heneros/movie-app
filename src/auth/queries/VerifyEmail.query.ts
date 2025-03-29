import { IQuery } from '@nestjs/cqrs';
import { Response } from 'express';
import { VerifyEmailDto } from './../dto/Verify-email.dto';

export class VerifyEmailQuery implements IQuery {
    constructor(
        public readonly verifyEmailDto: VerifyEmailDto,
        public readonly res: Response,
        public readonly userId: number,
    ) {}
}
