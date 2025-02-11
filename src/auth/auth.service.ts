import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from '@/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { domain, isDevelopment, roundsOfHashing } from '@/data/defaultData';
import { randomBytes } from 'crypto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { Request, Response } from 'express';
import { add } from 'date-fns';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
}
