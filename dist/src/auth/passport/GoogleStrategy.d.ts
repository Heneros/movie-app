import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { HandleIOauth } from '../services';
import { AuthRepository } from '../repositories/Auth.repository';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly config;
    private readonly handleIOauth;
    private readonly authRepository;
    constructor(config: ConfigService, handleIOauth: HandleIOauth, authRepository: AuthRepository);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
