export declare class AuthEntity {
    message?: string;
    id?: number;
    accessToken: [string];
    refreshToken?: string;
    name: string;
    email?: string;
    status?: number;
    constructor(partial: Partial<AuthEntity>);
}
