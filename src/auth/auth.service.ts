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
import { roundsOfHashing } from 'src/data/defaultData';
import { randomBytes } from 'crypto';

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

    return createdUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

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

  async verifyEmail(userId, emailToken) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        //token: emailToken,
      },
    });

    const emailVerificationToken =
      await this.prisma.verifyResetToken.findUnique({
        where: {
          userId: user.id,
          token: emailToken,
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

  async resendEmailValidation(email: string) {}

  async resetPassword(email: string) {}
  ///token sent to email
  async requestResetPassword(newPassword: string, confirmPassword) {}

  private generateJWT(id: number, name: string, roles: string[]) {
    return jwt.sign({ id: id, name: name, roles: roles }, process.env.JWT_KEY, {
      expiresIn: 3600000,
    });
  }
}
