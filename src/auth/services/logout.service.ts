import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

@Injectable()
export class LogoutAuthService {
  constructor() {}

  async logout(req: Request, res: Response) {
    if (!req.session) {
      return res.status(400).json({ message: 'Session not found' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }

      res.clearCookie('jwtMovie');
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  }
}
