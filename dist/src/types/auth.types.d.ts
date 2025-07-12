export type OAuthUrl = {
    url: String;
};
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        roles: string[];
    };
}
