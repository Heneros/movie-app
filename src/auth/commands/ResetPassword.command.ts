import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';

import { ResetPasswordDto } from '../dto/Reset-password.dto';

export class ResetPasswordCommand implements ICommand {
    constructor(
        public readonly userId: number,
        public readonly resetPasswordDto: ResetPasswordDto,
        public readonly res: Response,
    ) {}
}
