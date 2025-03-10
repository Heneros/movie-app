import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '@/mail/mail.service';
import { PAGINATION_LIMIT, roundsOfHashing } from '@/data/defaultData';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
}
