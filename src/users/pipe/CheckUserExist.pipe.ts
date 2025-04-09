import { PrismaService } from '@/prisma/prisma.service';
import {
    BadRequestException,
    Injectable,
    ParseIntPipe,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckUserExistPipe implements PipeTransform {
    constructor(private prisma: PrismaService) {}

    async transform(id?: number) {
        if (!id || isNaN(id)) {
            throw new BadRequestException('Either userId must be provided');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new BadRequestException('No user exists with this email');
        }

        if (user.blocked) {
            throw new BadRequestException('User is blocked');
        }

        return id;
    }
}
