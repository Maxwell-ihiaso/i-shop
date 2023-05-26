const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const Client = require("../init_redis");

// middlewares and functions to utiize json web token

const signAccessToken = (userId, isAdmin) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: userId,
      isAdmin,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30m",
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error("Issues with handshake", err);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  // check if the header has an authorization key
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const bearerToken = req.headers.authorization.split(" ");

  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.error("unable to complete handshake in middleware", err.message);
      return err.name === "JsonWebTokenError"
        ? next(createError.Unauthorized())
        : next(createError.Unauthorized(`You are logged out`));
    }

    req.user = payload;

    next();
  });
};

const verifyAccessTokenAndAuthorization = (req, res, next) => {
  verifyAccessToken(req, res, (err) => {
    if (err) return next(err);

    if (req.user.id === req.params.id || req.user.isAdmin) {
      return next();
    }
    next(createError.Unauthorized());
  });
};

const verifyAccessTokenAndAdmin = (req, res, next) => {
  console.log("Attempting verfication");
  verifyAccessToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user.isAdmin) {
      console.log("Admin verified");
      return next();
    }
    console.log("No Admin verified");

    next(createError.Forbidden());
  });
};

// Refresh token is used to handle a forgot password
// Redis is used to cache refresh token and black list on new ref token signing

const signRefreshToken = (userId, isAdmin) => {
  return new Promise((resolve, reject) => {
    const payload = { id: userId, isAdmin };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };

    JWT.sign(payload, secret, options, (err, refToken) => {
      if (err) {
        console.error("issue with refresh handshake", err);
        return reject(createError.InternalServerError());
      }

      Client.set(
        `${userId}`,
        refToken,
        "EX",
        365 * 24 * 60 * 60,
        (err, result) => {
          if (err) return reject(createError.InternalServerError(`${err}`));
          resolve(refToken);
        }
      );
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    if (!refreshToken) return reject(createError.BadRequest());

    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.id;

        Client.GET(userId, (err, reply) => {
          if (err) return reject(createError.InternalServerError());

          if (refreshToken === reply) return resolve(userId);

          return reject(createError.Unauthorized());
        });
      }
    );
  });
};

module.exports = {
  verifyAccessToken,
  signAccessToken,
  verifyAccessTokenAndAdmin,
  verifyAccessTokenAndAuthorization,
  signRefreshToken,
  verifyRefreshToken,
};
