import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LogInDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { isDevelopment } from '../../data/defaultData';
import { Request, Response } from 'express';

@Injectable()
export class LogoutAuthService {
  constructor() {}

  async logout(req: Request, res: Response) {
    res.clearCookie('jwtMovie', {});
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.send('Error destroying session');
      } else {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
    //
  }
}
