import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';
import { LogInDto } from '../dto-input/Login.dto';
import { CustomRequest } from '@/types/cus-request';

export class LoginUserCommand implements ICommand {
    constructor(
        // public readonly req: CustomRequest,
        // public readonly res: Response,
        public readonly logInDto: LogInDto,
    ) {}
}
