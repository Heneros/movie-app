import { GetIdUsersService } from '@/users/services/getIdUser.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private getIdUsersService;
    constructor(getIdUsersService: GetIdUsersService);
    validate(payload: {
        userId: number;
    }): Promise<{
        name: string;
        email: string;
        password: string;
        id: number;
        createdAt: Date;
        roles: string[];
        updatedAt: Date;
        isEmailVerified: boolean;
        refreshToken: string[];
        blocked: boolean;
        provider: string | null;
        googleId: string | null;
        githubId: string | null;
        discordId: string | null;
    }>;
}
export {};
