import { ICommand } from '@nestjs/cqrs';
import { UpdateUserRole } from '../dto/update-user-role.dto';

export class ChangeRoleCommand implements ICommand {
    constructor(
        public id: number,
        public updateUserRoleDto: UpdateUserRole,
    ) {}
}
