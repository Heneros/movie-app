import { CustomRequest } from '@/types/cus-request';
import { ICommand } from '@nestjs/cqrs';
import { Response } from 'express';
export declare class LogoutCommand implements ICommand {
    readonly req: CustomRequest;
    readonly res: Response;
    constructor(req: CustomRequest, res: Response);
}
