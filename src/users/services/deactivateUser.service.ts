import { PAGINATION_LIMIT, roundsOfHashing } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import express, { Response } from 'express';
import { UpdateUserDto } from '../dto-input/update-user.dto';

@Injectable()
export class DeactivateUserService {
    constructor(private prisma: PrismaService) {}

    async deactivate(id: number) {
        return await this.prisma.user.update({
            where: { id },
            data: { isEmailVerified: false, refreshToken: [] },
        });
    }
}
