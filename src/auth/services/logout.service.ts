import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as expressSession from 'express-session';

export interface RequestWithSession extends Request {
  session: expressSession.Session & expressSession.SessionData;
}

@Injectable()
export class LogoutAuthService {
  async logout(req: RequestWithSession): Promise<{ message: string }> {
    if (!req.session) {
      return { message: 'Logged out successfully (no session)' };
    }

    return new Promise<{ message: string }>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new Error('Failed to destroy session'));
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }
}
