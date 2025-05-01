export enum CACHE_TTL {
    TEN_SECONDS = 1000 * 10,

    ONE_MINUTE = 1000 * 60,
    FIVE_MINUTE = 5000 * 60,
    HALF_HOUR = 1000 * 60 * 30,

    ONE_HOUR = 1000 * 60 * 60,
    TWO_HOUR = 1000 * 2 * 60 * 60,
    THREE_HOUR = 1000 * 3 * 60 * 60,
    ONE_DAY = 1000 * 60 * 60 * 24,
    ONE_WEEK = 1000 * 7 * 24 * 60 * 60,
}
