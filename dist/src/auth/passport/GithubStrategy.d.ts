import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2';
import { AuthRepository } from '../repositories/Auth.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { HandleIOauth } from '../services';
declare const GithubStrategy_base: new (...args: [options: import("passport-github2").StrategyOptionsWithRequest] | [options: import("passport-github2").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GithubStrategy extends GithubStrategy_base {
    private readonly authRepository;
    private readonly prisma;
    private readonly handleIOauth;
    private readonly cloudinaryService;
    constructor(authRepository: AuthRepository, prisma: PrismaService, handleIOauth: HandleIOauth, cloudinaryService: CloudinaryService, config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
