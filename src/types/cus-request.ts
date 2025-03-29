import { Request, Response } from 'express';

export interface CustomRequest extends Request {
    cookies: { [key: string]: string };
    user?: any;
}

export interface CustomResponse extends Response {}
