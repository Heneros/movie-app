import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/Auth.repository';
import { JwtService } from '@nestjs/jwt';
import { HandleIOauth } from './HandleIOauth.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class GithubService extends HandleIOauth {
    constructor(
        protected readonly authRepository: AuthRepository,
        protected readonly JwtService: JwtService,
        protected readonly cloudinaryService: CloudinaryService,
        protected readonly prisma: PrismaService,
    ) {
        super(authRepository, JwtService, cloudinaryService, prisma);
    }

    async validateGithubUser(profile: any) {
        try {
            return await this.handleOauthLogin(profile.email);
        } catch (error) {
            console.log(error, 'error');
        }
    }
}
