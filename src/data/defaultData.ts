export const PAGINATION_LIMIT = parseInt(process.env.PAGINATION, 10);

export const jwtConstants = {
  secret: process.env.JWT_SECRET!,
};
