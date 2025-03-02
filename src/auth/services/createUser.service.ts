import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { roundsOfHashing, tempRegisterDate } from '@/data/defaultData';
import { MailService } from '@/mail/mail.service';
// import { Response } from 'express';

@Injectable()
export class CreateUserService {
  constructor(
    private prisma: PrismaService,
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

    const tokenVerification = randomBytes(32).toString('hex');

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
        expiresAt: tempRegisterDate,
      },
    });

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

    // res
    //   .status(201)
    //   .json({ message: 'Welcome to Movie App! Confirm your Email ' });

    return {
      id: createdUser.id,
      email: createUserDto.email,
      emailVerificationToken: emailVerificationToken.token,
      createdUser,
    };
  }
}
