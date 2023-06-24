"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.EXCHANGE_NAME = exports.MSG_QUEUE_URL = exports.STRIPE_KEY = exports.DOMAIN_NAME = exports.BCRYPT_SALT_ROUNDS = exports.REDIS_PASSWORD = exports.REDIS_PORT = exports.REDIS_HOSTNAME = exports.MONGO_URI = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.ENVIRONMENT = exports.PORT = void 0;
require("dotenv/config");
exports.PORT = process.env.PORT;
exports.ENVIRONMENT = process.env.NODE_ENV;
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.MONGO_URI = process.env.MONGO_URI;
exports.REDIS_HOSTNAME = process.env.REDIS_HOSTNAME;
exports.REDIS_PORT = process.env.REDIS_PORT;
exports.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
exports.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;
exports.DOMAIN_NAME = process.env.DOMAIN_NAME;
exports.STRIPE_KEY = process.env.STRIPE_KEY;
exports.MSG_QUEUE_URL = process.env.MSG_QUEUE_URL;
exports.EXCHANGE_NAME = process.env.EXCHANGE_NAME;
exports.APP_SECRET = process.env.APP_SECRET;