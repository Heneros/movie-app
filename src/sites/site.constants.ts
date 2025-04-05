export const AUTH_CONTROLLER = 'auth' as const;

export const AUTH_ROUTES = {
    REGISTER: '',
    LOGIN: 'login',
    LOGOUT: 'logout',
    VERIFY: 'verify/:emailToken/:userId',
    RESEND_EMAIL: 'resend_email_token/:userId',
    RESET_PASSWORD: 'reset_password',
    RESET_PASSWORD_REQUEST: 'reset_password_request/:userId',
};

export const USERS_CONTROLLER = 'users' as const;

export const USERS_ROUTES = {
    GET_ALL: '',
    GET_ID_USER: ':id',
    UPDATE_USER: ':id',
    DELETE_USER: ':id',
    CHANGE_ROLE: ':id/role',
    DELETE_MY_ACCOUNT: ':id/myaccount',
    DEACTIVATE_USER_ACCOUNT: ':id/deactivate',
    LIST_BLOCKED_USERS: 'blocked-list',
    SEND_COMPLAINT: ':id/complaint',
};
