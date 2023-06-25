import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import amqplib from 'amqplib';
import createError from 'http-errors';

import {
  // APP_SECRET,
  // EXCHANGE_NAME,
  //   CUSTOMER_SERVICE,
  // MSG_QUEUE_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../config';
import { Store } from '../database';

//Utility functions
export const GenerateSalt = async (hash: number) => {
  return await bcrypt.genSalt(hash);
};

export const GeneratePassword = async (password: string, salt: any) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

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

export const signAccessToken = (userId: string, roles: number[]) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: userId,
      roles,
    };

    const options = {
      expiresIn: '30m',
    };

    jwt.sign(payload, ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err) {
        return reject(
          createError.InternalServerError(
            'Unable to establish token handshake',
          ),
        );
      }
      resolve(token);
    });
  });
};

export interface CustomRequest extends Request {
  user?: any;
}

export const verifyAccessToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // check if the header has an authorization key
  if (!req.headers['authorization']) return next(createError.Unauthorized());

  const bearerToken = req.headers.authorization.split(' ');

  const token = bearerToken[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return err.name === 'JsonWebTokenError'
        ? next(createError.Unauthorized('wrong credentials provided'))
        : next(createError.Unauthorized(`You are logged out`));
    }

    req.user = payload;

    next();
  });
};

export const verifyAccessTokenAndAuthorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  verifyAccessToken(req, res, (err) => {
    if (err) return next(err);

    if (req?.user?.id === req.params.id || req?.user?.isAdmin) {
      return next();
    }
    next(createError.Unauthorized());
  });
};

export const verifyAccessTokenAndAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  verifyAccessToken(req, res, (err) => {
    if (err) return next(err);
    if (req?.user?.isAdmin) {
      return next();
    }
    next(
      createError.Forbidden(
        'You do not have the permission to access this resource',
      ),
    );
  });
};

// Refresh token is used to handle a forgot password
// Redis is used to cache refresh token and black list on new ref token signing

export const signRefreshToken = (userId: any, roles: number[]) => {
  let store = new Store();
  return new Promise((resolve, reject) => {
    const payload = { id: userId, roles };
    const options = {
      expiresIn: '1y',
    };

    jwt.sign(payload, REFRESH_TOKEN_SECRET, options, (err, refToken) => {
      if (err) {
        return reject(createError.InternalServerError("wrong credentials provided"));
      }

      store.setStore(`${userId}`, refToken, (err, result) => {
        if (err) return reject(createError.InternalServerError(`${err}`));
        resolve(result);
      });
    });
  });
};

export const verifyRefreshToken = (refreshToken: any) => {
  let store = new Store();
  return new Promise((resolve, reject) => {
    if (!refreshToken) return reject(createError.BadRequest());

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, payload: any) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload?.id;

      store.getStore(userId, (err, reply) => {
        if (err) return reject(createError.InternalServerError());

        if (refreshToken === reply) return resolve(userId);

        return reject(createError.Unauthorized());
      });
    });
  });
};

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
