import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

import { ACCESS_TOKEN_SECRET } from '@/config'

export interface CustomRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
}
/**
 * Verify if the user has the required roles to access a resource
 * @param allowedRoles Array of numbers representing the allowed roles
 * @returns Middleware function that checks if the user has the required roles
 * @throws Forbidden error if the user does not have access
 */
export const verifyRoles = (...allowedRoles: number[]) => {
  /**
   * Middleware function that checks if the user has the required roles
   * @param req Express request object
   * @param _res Express response object
   * @param next Express next function
   */
  return (req: CustomRequest, _res: Response, next: NextFunction): void => {
    try {
      // If user roles are undefined, throw Forbidden error
      if (req?.user?.roles === undefined) {
        throw createHttpError.Forbidden(
          'You do not have access to this resource'
        )
      }

      // Create a copy of allowed roles
      const rolesArray = [...allowedRoles]

      console.log(req.user?.roles)

      // Check if any of the user roles match the allowed roles
      const isAllowed: boolean = req.user?.roles.some((role: number) =>
        rolesArray.includes(role)
      )
      console.log({ isAllowed })

      // If user doesn't have access, throw Forbidden error
      if (!isAllowed) {
        throw createHttpError.Forbidden(
          'You do not have access to this resource'
        )
      }

      // Call the next middleware
      next()
    } catch (error) {
      // Pass error to the error handling middleware
      next(error)
    }
  }
}

/**
 * Verifies the access token in the request header.
 * If the token is valid, adds the payload to the request object and passes to the next middleware.
 * If the token is invalid, throws an unauthorized error.
 *
 * @param req - Express request object.
 * @param _res - Express response object.
 * @param next - Express next function.
 */
export const verifyAccessToken = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): void => {
  // Check if the header has an authorization key.
  if (req.headers.authorization != null) {
    // Extract token from bearer token format.
    const bearerToken = req.headers.authorization.split(' ')
    const token = bearerToken?.[1]

    // Verify token with JWT library.
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err != null) {
        // If token is invalid, throw unauthorized error with specific message.
        err.name === 'JsonWebTokenError'
          ? next(
              createHttpError.Unauthorized(
                'Wrong credentials provided. Please log in.'
              )
            )
          : next(createHttpError.Unauthorized('You are logged out.'))
        return
      }

      // If token is valid, add payload to request object and pass to next middleware.
      req.user = payload
      next()
    })
  } else {
    next(createHttpError.Unauthorized())
  }
}
