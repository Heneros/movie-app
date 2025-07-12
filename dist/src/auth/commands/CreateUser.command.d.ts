import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '@/auth/dto-input/Create-user.dto';
export declare class CreateUserCommand implements ICommand {
    readonly createUserDto: CreateUserDto;
    constructor(createUserDto: CreateUserDto);
}
