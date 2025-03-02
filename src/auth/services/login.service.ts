import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { LogInDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { isDevelopment, tempLoginDate } from '@/data/defaultData';
import { Request, Response } from 'express';
// import { isDevelopment, tempLoginDate } from '@/data/defaultData';

@Injectable()
export class LoginAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(logInDto: LogInDto, req: Request, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: logInDto.email },
    });

    const isPasswordValid = await bcrypt.compare(
      logInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    // const tokens = await this.generateToken(payload);

    const payload = { id: user.id, name: user.name, roles: user.roles };

    const newRefreshToken = await this.jwtService.signAsync(payload);
    const cookies = req?.cookies;

    let newRefreshTokenArray = !cookies?.jwtMovie
      ? user.refreshToken
      : user.refreshToken.filter((refT) => refT !== cookies?.jwtMovie);

    // console.log('newRefreshToken', newRefreshTokenArray);

    if (cookies?.jwtMovie) {
      const refreshToken = cookies.jwtMovie;

      const existingRefreshToken = await this.prisma.user.findFirst({
        where: {
          id: user.id,
          refreshToken: { hasSome: [refreshToken] },
        },
      });
      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie('jwtMovie', {});
    }

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

    // const tokens = await this.generateToken(payload);
    // await this.saveRefreshToken(user.id, tokens.refreshToken);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.prisma.verifyResetToken.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.verifyResetToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: tempLoginDate,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
    });

    // if (!req.session) {
    //   throw new UnauthorizedException('Session is not initialized');
    // }

    // console.log('Cookies:', req.cookies);

    // req.session.user = payload;

    res.cookie('jwtMovie', newRefreshToken, {
      httpOnly: isDevelopment ? false : true,
      // strict: isDevelopment ? 'none' : 'strict',
      maxAge: 31 * 24 * 60 * 60 * 1000,
      secure: isDevelopment ? false : true,
    });

    return {
      // newRefreshToken, id: user.id, user: user, email: user.id
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      refreshToken: newRefreshToken,
    };
    // res.status(200).json({
    //   message: 'Login successful',
    //   newRefreshToken,
    // });
  }
}
