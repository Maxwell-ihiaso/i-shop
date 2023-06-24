import 'dotenv/config';

export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.NODE_ENV;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export const MONGO_URI = process.env.MONGO_URI!;
export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME!;
export const REDIS_PORT = process.env.REDIS_PORT!;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS!;
export const DOMAIN_NAME = process.env.DOMAIN_NAME!;
export const STRIPE_KEY = process.env.STRIPE_KEY!;
export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL!;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME!;
export const APP_SECRET = process.env.APP_SECRET!;
