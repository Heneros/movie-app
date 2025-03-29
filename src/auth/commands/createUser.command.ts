import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '@/auth/dto/Create-user.dto';

export class CreateUserCommand implements ICommand {
    constructor(public readonly createUserDto: CreateUserDto) {}
}
