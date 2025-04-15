import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class GithubService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
    ) {}

    async validateGithubUser(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });

        if (user) {
            throw new BadRequestException('User registered');
        }

        const avatarPublicId = `nestjsMoviedb/avatars/${profile.id}_${Date.now()}`;

        
    }
}
