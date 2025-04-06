import { ICommand } from '@nestjs/cqrs';
import { UpdateUserRole } from '../dto/update-user-role.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export class ChangeRoleCommand implements ICommand {
    constructor(
        public id: number,
        public updateUserDto: UpdateUserDto,
    ) {}
}
