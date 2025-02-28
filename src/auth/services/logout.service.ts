import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as expressSession from 'express-session';

interface RequestWithSession extends Request {
  session: expressSession.Session & expressSession.SessionData;
}

@Injectable()
export class LogoutAuthService {
  constructor() {}

  async logout(req: Request, res: Response) {
    const reqWithSession = req as RequestWithSession;

    if (!reqWithSession.session) {
      return res.status(400).json({ message: 'Session not found' });
    }

    reqWithSession.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      res.clearCookie('jwtMovie');
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  }
}
