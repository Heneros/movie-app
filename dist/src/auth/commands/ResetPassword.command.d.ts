import { ICommand } from '@nestjs/cqrs';
import { ResetPasswordDto } from '../dto-input/Reset-password.dto';
export declare class ResetPasswordCommand implements ICommand {
    readonly userId: number;
    readonly emailToken: string;
    readonly resetPasswordDto: ResetPasswordDto;
    constructor(userId: number, emailToken: string, resetPasswordDto: ResetPasswordDto);
}
