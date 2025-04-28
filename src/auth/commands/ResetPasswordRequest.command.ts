import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';
import { EmailDto } from '../dto-input/Resend-email.dto';

export class ResetPasswordRequestCommand implements ICommand {
    constructor(
        public readonly userId: number,
        public readonly resendEmailDto: string,
        public readonly res: Response,
    ) {}
}
