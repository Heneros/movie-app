import { Request } from 'express';
import * as session from 'express-session';
export interface CustomRequest extends Request {
    cookies: {
        [key: string]: string;
    };
    user?: any;
    session: session.Session;
}
