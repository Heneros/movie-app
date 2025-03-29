export const AUTH_CONTROLLER = 'auth' as const;

export const AUTH_ROUTES = {
    REGISTER: '',
    LOGIN: 'login',
    LOGOUT: 'logout',
    VERIFY: 'verify/:emailToken/:userId',
    RESEND_EMAIL: 'resend_email_token',
    RESET_PASSWORD: 'reset_password',
};
