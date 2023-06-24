"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_1 = require("../config");
// import createError from 'http-errors';
const host = config_1.REDIS_HOSTNAME;
const port = Number(config_1.REDIS_PORT);
// const password = REDIS_PASSWORD;
const client = (0, redis_1.createClient)({
    socket: {
        host,
        port,
    },
});
client.on('connect', () => console.log('Connecting to redis cache...'));
client.on('ready', () => console.log('connected to redis cache!'));
client.on('error', (err) => console.log('Redis error', err));
client.on('end', () => console.log('redis instance closed successfully!'));
process.on('SIGINT', () => client.quit());
class Store {
    constructor() { }
    setStore(userId, refToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${userId}`;
            const value = refToken;
            yield client.connect();
            yield client
                .set(key, value)
                .then((result) => callback(null, result))
                .catch((err) => callback(err, null));
            yield client.disconnect();
        });
    }
    getStore(key, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client.connect();
            yield client
                .get(key)
                .then((result) => callback(null, result))
                .catch((err) => callback(err, null));
            yield client.disconnect();
        });
    }
}
exports.default = Store;
