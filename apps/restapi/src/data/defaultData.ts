export const PAGINATION_LIMIT = parseInt(process.env.PAGINATION, 10);

export const jwtConstants = {
  secret: process.env.JWT_SECRET!,
};

export const roundsOfHashing = 10;
export const domain = process.env.DOMAIN_DEV;

export const tempRegisterDate = new Date(Date.now() + 5 * 60 * 1000);
export const tempLoginDate = new Date(Date.now() + 31 * 60 * 60 * 1000);
export const tempRequestPassDate = new Date(Date.now() + 12 * 60 * 1000);

export const isDevelopment = process.env.NODE_ENV === 'development';
