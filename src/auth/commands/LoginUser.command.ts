import { ICommand } from '@nestjs/cqrs';
import { LogInDto } from '../dto-input/Login.dto';

export class LoginUserCommand implements ICommand {
    constructor(
        // public readonly req: CustomRequest,
        // public readonly res: Response,
        public readonly logInDto: LogInDto,
    ) {}
}
