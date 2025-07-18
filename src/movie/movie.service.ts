import {  Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MovieService {
    constructor(private prisma: PrismaService) {}
}
