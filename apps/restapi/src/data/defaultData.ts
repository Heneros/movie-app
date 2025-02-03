export const PAGINATION_LIMIT = parseInt(process.env.PAGINATION, 10);

export const jwtConstants = {
  secret: process.env.JWT_SECRET!,
};

export const roundsOfHashing = 10;
export const domain = process.env.DOMAIN_DEV;

export const isDevelopment = process.env.NODE_ENV === 'development';
