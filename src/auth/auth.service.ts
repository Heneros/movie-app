import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { domain, roundsOfHashing } from 'src/data/defaultData';
import { randomBytes } from 'crypto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LogInDto } from './dto/login.dto';

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

  async login(logInDto: LogInDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: logInDto.email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${logInDto.email}`);
    }

    const isPasswordValid = await bcrypt.compare(logInDto.email, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!user.isEmailVerified) {
      throw new BadRequestException('Not verified email');
    }

    const payload = { id: user.id, name: user.name, roles: user.roles };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
        //token: emailToken,
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

  async requestResetPassword(resendEmailDto: ResendEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendEmailDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
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
        createdAt: new Date().toISOString(),
      },
    });

    if (!user && user.isEmailVerified) {
      throw new BadRequestException('User already verified');
    }

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

    if (!user) {
      throw new BadRequestException('User not found');
    }
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
  ///token sent to email

  private generateJWT(id: number, name: string, roles: string[]) {
    return jwt.sign({ id: id, name: name, roles: roles }, process.env.JWT_KEY, {
      expiresIn: 3600000,
    });
  }
}
