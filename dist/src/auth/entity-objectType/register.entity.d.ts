export declare class AuthRegister {
    emailVerificationToken: {
        userId: number;
        token: string;
        createdAt: Date;
    };
    email: string;
    constructor(partial: Partial<AuthRegister>);
}
