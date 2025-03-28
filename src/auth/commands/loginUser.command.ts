import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { Response } from 'express';
import { LogInDto } from '../dto/login.dto';

export class LoginUserCommand implements ICommand {
    constructor(
        public readonly logInDto: LogInDto,
        public readonly req: Request,
    ) {}
}
