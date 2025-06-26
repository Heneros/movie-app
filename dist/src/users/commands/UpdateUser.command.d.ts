import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from '../dto-input/update-user.dto';
export declare class UpdateUserCommand implements ICommand {
    id: number;
    updateUserDto: UpdateUserDto;
    constructor(id: number, updateUserDto: UpdateUserDto);
}
