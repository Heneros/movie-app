import { ICommand } from '@nestjs/cqrs';
import { UpdateUserRole } from '../dto-input/update-user-role.dto';
export declare class ChangeRoleCommand implements ICommand {
    id: number;
    updateUserRoleDto: UpdateUserRole;
    constructor(id: number, updateUserRoleDto: UpdateUserRole);
}
