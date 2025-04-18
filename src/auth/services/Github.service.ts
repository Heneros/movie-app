import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/Auth.repository';
import { JwtService } from '@nestjs/jwt';
import { tempRegisterDate } from '@/data/defaultData';
@Injectable()
export class GithubService {
    constructor(
        private authRepository: AuthRepository,
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
        private JwtService: JwtService,
    ) {}

    async validateGithubUser(profile: any) {
        try {
            // let email = profile.email;
            let user = await this.authRepository.findUser({
                email: profile.email,
            });

            // console.log('123', profile);
            // console.log('123', user);
            // if (!user) {
            //     return user;
            // }

            // console.log(profile);

            const payload = {
                id: user.id,
                name: user.name,
                roles: user.roles,
            };

            const accessTokenJwt = await this.JwtService.signAsync(payload, {
                expiresIn: '15m',
            });
            const refreshTokenJwt = await this.JwtService.signAsync(payload, {
                expiresIn: '31d',
            });

            // console.log(refreshTokenJwt);
            // await this.authRepository.deleteToken({
            //     where: { userId: user.id },
            // });
            await this.authRepository.createToken({
                userId: user.id,
                token: refreshTokenJwt,
                tempDate: tempRegisterDate,
            });

            await this.authRepository.updateProfile(user.id, {
                refreshToken: [accessTokenJwt],
            });
            // console.log(payload);
            return user;
        } catch (error) {
            console.log(error, 'error');
        }
    }
}
