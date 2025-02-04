import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { domain, isDevelopment, roundsOfHashing } from '../data/defaultData';
import { randomBytes } from 'crypto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request, Response } from 'express';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LogInDto } from './dto/login.dto';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('Confirm password.', {
        cause: new Error(),
        description: 'Check the passwords you provided.',
      });
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    const tokenVerification = randomBytes(20).toString('hex');

    createUserDto.password = hashedPassword;

    const userEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userEmail) {
      throw new BadRequestException('User already exists with this email', {
        cause: new Error(),
        description: 'Try another email',
      });
    }

    const userData = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };

    const createdUser = await this.prisma.user.create({
      data: userData,
    });

    const emailVerificationToken = await this.prisma.verifyResetToken.create({
      data: {
        userId: createdUser.id,
        token: tokenVerification,
      },
    });

    // console.log('emailVerficationToken', emailVerficationToken);

    await this.mailService.sendEmail(
      true,
      {
        ...createdUser,
        email: createUserDto.email,
      },
      'Welcome to Movie App! Confirm your Email ',
      './confirmation',
      emailVerificationToken,
    );

    return { email: createUserDto.email, emailVerificationToken };
  }

  async login(logInDto: LogInDto, req, res) {
    const user = await this.prisma.user.findUnique({
      where: { email: logInDto.email },
    });

    const isPasswordValid = await bcrypt.compare(
      logInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, name: user.name, roles: user.roles };

    const newRefreshToken = await this.jwtService.signAsync(payload);

    const cookies = req.cookies;

    // console.log(cookies);

    let newRefreshTokenArray = !cookies?.jwtMovie
      ? user.refreshToken
      : user.refreshToken.filter((refT) => refT !== cookies?.jwtMovie);

    console.log('newRefreshToken', newRefreshTokenArray);

    if (cookies?.jwtMovie) {
      const refreshToken = cookies.jwtMovie;

      const existingRefreshToken = await this.prisma.user.findFirst({
        where: {
          id: user.id,
          // refreshToken: user.refreshToken,
          refreshToken: { hasSome: [refreshToken] },
        },
      });
      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie('jwtMovie', {});
    }

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: [...newRefreshTokenArray, newRefreshToken] },
    });

    if (!req.session) {
      throw new UnauthorizedException('Session is not initialized');
    }

    req.session.user = payload;

    // await new Promise((resolve) => req.session.save(resolve));
    res.cookie('jwtMovie', newRefreshToken, {
      httpOnly: isDevelopment ? false : true,
      strict: isDevelopment ? 'none' : 'strict',
      maxAge: 31 * 24 * 60 * 60 * 1000,
      secure: isDevelopment ? false : true,
    });

    res.status(200).json({
      message: 'Login successful',
      newRefreshToken,
    });
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: verifyEmailDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found ');
    }

    if (user?.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
      },
    });

    const emailVerificationToken =
      await this.prisma.verifyResetToken.findUnique({
        where: {
          userId: user.id,
          token: verifyEmailDto.emailToken,
        },
      });

    if (!emailVerificationToken) {
      throw new BadRequestException('Expired token');
    }

    await this.mailService.sendEmail(
      false,
      user,
      'Your email is verified!',
      './welcome',
      emailVerificationToken,
    );

    // return user;
    // console.log('userToken', emailToken);
    // console.log('prismauserId', prismauserId);
  }

  async resendEmailValidation(resendEmailDto: ResendEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendEmailDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('User already verified');
    }

    const verificationToken = await this.prisma.verifyResetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (verificationToken) {
      await this.prisma.verifyResetToken.delete({
        where: {
          userId: user.id,
        },
      });
    }
    const resentToken = randomBytes(32).toString('hex');

    const emailToken = await this.prisma.verifyResetToken.create({
      data: {
        userId: user.id,
        token: resentToken,
      },
    });

    const emailLink = `${domain}/auth/verify/${emailToken.token}/${user.id}`;

    const payload = {
      name: user.name,
      link: emailLink,
    };

    await this.mailService.resendEmail(
      user,
      'Welcome to Movie App! Confirm your Email ',
      './confirmation',
      payload,
    );
    return {
      statusCode: 200,
      message: 'Email was successfully sent',
    };

    // console.log(user);
  }

  async requestResetPassword(res: Response, resendEmailDto: ResendEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendEmailDto.email },
    });

    const verificationToken = await this.prisma.verifyResetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (verificationToken) {
      await this.prisma.verifyResetToken.delete({
        where: {
          userId: user.id,
        },
      });
    }
    const resentToken = randomBytes(32).toString('hex');

    const emailToken = await this.prisma.verifyResetToken.create({
      data: {
        userId: user.id,
        token: resentToken,
        createdAt: new Date().toISOString(),
      },
    });

    // if (user.isEmailVerified) {
    //   throw new BadRequestException('User already verified');
    // }

    const emailLink = `${domain}/auth/reset_password?emailToken=${emailToken.token}&userId=${user.id}`;

    const payload = {
      name: user.name,
      link: emailLink,
    };

    await this.mailService.resendEmail(
      user,
      'Password Reset Request',
      './requestResetPassword',
      payload,
    );

    res.status(200).json({
      message: 'Password Reset Request',
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
      throw new BadRequestException('Password do not match');
    }

    const verificationToken = await this.prisma.verifyResetToken.findUnique({
      where: {
        userId: resetPasswordDto.userId,
      },
    });
    if (!verificationToken) {
      throw new BadRequestException(
        'Your token is either invalid or expired. Try resetting your password again',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: verificationToken.userId,
      },
    });

    if (user && verificationToken) {
      const newPass = await bcrypt.hash(
        resetPasswordDto.password,
        roundsOfHashing,
      );

      const user = await this.prisma.user.update({
        where: {
          id: verificationToken.userId,
        },
        data: {
          password: newPass,
        },
      });

      // console.log(user);
      const payload = {
        name: user.name,
        link: null,
      };

      await this.mailService.resendEmail(
        user,
        'Your password was reset successfully!',
        './resetPassword',
        payload,
      );

      return {
        statusCode: 200,
        message: 'Your password was reset successfully!',
      };
    }
  }

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

  private generateJWT(id: number, name: string, roles: string[]) {
    return jwt.sign({ id: id, name: name, roles: roles }, process.env.JWT_KEY, {
      expiresIn: 3600000,
    });
  }
}
