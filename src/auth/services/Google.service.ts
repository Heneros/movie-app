import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/Auth.repository';

import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { HandleIOauth } from './HandleIOauth.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class GoogleService extends HandleIOauth {
    constructor(
        protected readonly authRepository: AuthRepository,
        protected readonly JwtService: JwtService,
        protected readonly cloudinaryService: CloudinaryService,
        protected readonly prisma: PrismaService,
    ) {
        super(authRepository, JwtService, cloudinaryService, prisma);
    }

    async validateGoogleUser(profile: any) {
        try {
            return await this.handleOauthLogin(profile.email);
        } catch (error) {
            throw new BadRequestException('Something wrong happened');
        }
    }

    async getGoogleUserByToken(
        token: string,
    ): Promise<{ email: string; name: string }> {
        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data;
    }
}
