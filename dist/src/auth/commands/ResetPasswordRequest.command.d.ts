import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';
export declare class ResetPasswordRequestCommand implements ICommand {
    readonly userId: number;
    readonly resendEmailDto: string;
    readonly res: Response;
    constructor(userId: number, resendEmailDto: string, res: Response);
}
