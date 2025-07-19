export const AUTH_CONTROLLER = 'auth' as const;

export const AUTH_ROUTES = {
    REGISTER: '',
    LOGIN: 'login',
    LOGOUT: 'logout',
    VERIFY: 'verify/:emailToken/:userId',
    RESEND_EMAIL: 'resend_email_token/:userId',
    RESET_PASSWORD: 'reset_password',
    RESET_PASSWORD_REQUEST: 'reset_password_request/:userId',
    GOOGLE: 'google',
    GOOGLE_CALLBACK: 'google/callback',
    GOOGLE_REDIRECT: 'google/redirect',
    GITHUB: 'github',
    GITHUB_CALLBACK: 'github/callback',

    DISCORD: 'discord',
    DISCORD_CALLBACK: 'discord/callback',
};

export const USERS_CONTROLLER = 'users' as const;

export const USERS_ROUTES = {
    GET_ALL: '',
    GET_ID_USER: ':id',
    UPDATE_USER: ':userId',
    DELETE_USER: ':id',
    CHANGE_ROLE: ':id/role',
    DELETE_MY_ACCOUNT: ':userId/myaccount',
    BAN_USER_ACCOUNT: ':id/ban',
    LIST_BLOCKED_USERS: 'blocked-list',
    UPLOAD_AVATAR_USER: 'upload/:userId',
    SEND_COMPLAINT: ':id/complaint',
};

export const MOVIE_CONTROLLER = 'movie' as const;

export const MOVIE_ROUTES = {
    GET_ALL: '',
    EVENTS: 'events',
    SEARCH: 'search',
    REVIEWS_ALL: 'reviewsAll',
    DRAFTS: 'drafts',
    GET_ID_MOVIE: ':id',
    CREATE_MOVIE: '',
    UPDATE_MOVIE: ':id',
    DELETE_MOVIE: ':id',
    ADD_FAVORITE: ':id/addFav',
    REMOVE_FAVORITE: ':userId/removeFav/:movieId',
    ALL_FAVORITE: ':userId/allFavorites',
    RATE_MOVIE: ':id/rateMovie',

    GET_All_REVIEW_FROM_MOVIE: ':id/review',
    GET_SINGLE_REVIEW_FROM_MOVIE: ':id/singleReview',
    CREATE_REVIEW: ':id/review',

    UPDATE_REVIEW: ':id/review/user/:userId',
    DELETE_REVIEW: ':id/review/:userId',

    UPLOAD_IMAGES: 'gallery/:id',
    FILTER: 'filter',

    IMAGE_PREVIEW: 'preview/:id',
};
