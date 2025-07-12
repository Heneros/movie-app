import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-discord';
import { AuthRepository } from '../repositories/Auth.repository';
import { HandleIOauth } from '../services';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PrismaService } from '@/prisma/prisma.service';
declare const DiscordStrategy_base: new (...args: [options: Strategy.StrategyOptionsWithRequest] | [options: Strategy.StrategyOptions] | [options: Strategy.StrategyOptions] | [options: Strategy.StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class DiscordStrategy extends DiscordStrategy_base {
    private readonly authRepository;
    private readonly prisma;
    private readonly handleIOauth;
    private readonly cloudinaryService;
    constructor(authRepository: AuthRepository, prisma: PrismaService, handleIOauth: HandleIOauth, cloudinaryService: CloudinaryService, config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
