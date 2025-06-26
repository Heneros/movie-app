import { ICommand } from '@nestjs/cqrs';
import { LogInDto } from '../dto-input/Login.dto';
export declare class LoginUserCommand implements ICommand {
    readonly logInDto: LogInDto;
    constructor(logInDto: LogInDto);
}
