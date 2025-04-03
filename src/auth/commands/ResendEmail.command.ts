import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';

import { EmailDto } from '../dto/Resend-email.dto';

export class ResendEmailCommand implements ICommand {
    constructor(
        public readonly userId: number,
        public readonly email: EmailDto,
        public readonly res?: Response,
    ) {}
}
