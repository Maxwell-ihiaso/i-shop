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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyAccessTokenAndAdmin = exports.verifyAccessTokenAndAuthorization = exports.verifyAccessToken = exports.signAccessToken = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import amqplib from 'amqplib';
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
const database_1 = require("../database");
//Utility functions
const GenerateSalt = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt(hash);
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
// module.exports.ValidatePassword = async (
//   enteredPassword,
//   savedPassword,
//   salt
// ) => {
//   return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword
// }
// module.exports.GenerateSignature = async (payload) => {
//   try {
//     return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' })
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }
// module.exports.ValidateSignature = async (req: Request) => {
//   try {
//     const signature = req.get('Authorization')
//     console.log(signature)
//     const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET)
//     req.user = payload
//     return true
//   } catch (error) {
//     console.log(error)
//     return false
//   }
// }
// module.exports.FormateData = (data) => {
//   if (data) {
//     return { data }
//   } else {
//     throw new Error('Data Not found!')
//   }
// }
const signAccessToken = (userId, isAdmin) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: userId,
            isAdmin,
        };
        const options = {
            expiresIn: '30m',
        };
        jsonwebtoken_1.default.sign(payload, config_1.ACCESS_TOKEN_SECRET, options, (err, token) => {
            if (err) {
                return reject(http_errors_1.default.InternalServerError('Unable to establish token handshake'));
            }
            resolve(token);
        });
    });
};
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (req, res, next) => {
    // check if the header has an authorization key
    if (!req.headers['authorization'])
        return next(http_errors_1.default.Unauthorized());
    const bearerToken = req.headers.authorization.split(' ');
    const token = bearerToken[1];
    jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return err.name === 'JsonWebTokenError'
                ? next(http_errors_1.default.Unauthorized('wrong credentials provided'))
                : next(http_errors_1.default.Unauthorized(`You are logged out`));
        }
        req.user = payload;
        next();
    });
};
exports.verifyAccessToken = verifyAccessToken;
const verifyAccessTokenAndAuthorization = (req, res, next) => {
    (0, exports.verifyAccessToken)(req, res, (err) => {
        var _a, _b;
        if (err)
            return next(err);
        if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) === req.params.id || ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.isAdmin)) {
            return next();
        }
        next(http_errors_1.default.Unauthorized());
    });
};
exports.verifyAccessTokenAndAuthorization = verifyAccessTokenAndAuthorization;
const verifyAccessTokenAndAdmin = (req, res, next) => {
    (0, exports.verifyAccessToken)(req, res, (err) => {
        var _a;
        if (err)
            return next(err);
        if ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.isAdmin) {
            return next();
        }
        next(http_errors_1.default.Forbidden('You do not have the permission to access this resource'));
    });
};
exports.verifyAccessTokenAndAdmin = verifyAccessTokenAndAdmin;
// Refresh token is used to handle a forgot password
// Redis is used to cache refresh token and black list on new ref token signing
const signRefreshToken = (userId, isAdmin) => {
    let store = new database_1.Store();
    return new Promise((resolve, reject) => {
        const payload = { id: userId, isAdmin };
        const options = {
            expiresIn: '1y',
        };
        jsonwebtoken_1.default.sign(payload, config_1.REFRESH_TOKEN_SECRET, options, (err, refToken) => {
            if (err) {
                console.error('issue with refresh handshake', err);
                return reject(http_errors_1.default.InternalServerError());
            }
            store.setStore(`${userId}`, refToken, (err, result) => {
                if (err)
                    return reject(http_errors_1.default.InternalServerError(`${err}`));
                console.log(result);
                resolve(result);
            });
        });
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (refreshToken) => {
    let store = new database_1.Store();
    return new Promise((resolve, reject) => {
        if (!refreshToken)
            return reject(http_errors_1.default.BadRequest());
        jsonwebtoken_1.default.verify(refreshToken, config_1.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err)
                return reject(http_errors_1.default.Unauthorized());
            const userId = payload === null || payload === void 0 ? void 0 : payload.id;
            store.getStore(userId, (err, reply) => {
                if (err)
                    return reject(http_errors_1.default.InternalServerError());
                if (refreshToken === reply)
                    return resolve(userId);
                return reject(http_errors_1.default.Unauthorized());
            });
        });
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
// //Message Broker
// export const CreateChannel = async () => {
//   try {
//     const connection = await amqplib.connect(MSG_QUEUE_URL);
//     const channel = await connection.createChannel();
//     await channel.assertQueue(EXCHANGE_NAME, 'direct', { durable: true });
//     return channel;
//   } catch (err) {
//     throw err;
//   }
// };
// export const PublishMessage = (channel, service, msg) => {
//   channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//   console.log('Sent: ', msg);
// };
// export const SubscribeMessage = async (channel, service) => {
//   await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
//   const q = await channel.assertQueue('', { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);
//   channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);
//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         console.log('the message is:', msg.content.toString());
//         service.SubscribeEvents(msg.content.toString());
//       }
//       console.log('[X] received');
//     },
//     {
//       noAck: true,
//     },
//   );
// };
