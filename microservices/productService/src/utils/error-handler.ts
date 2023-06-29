import { createLogger, transports, format } from 'winston'
import { type NextFunction, type Request, type Response } from 'express'

interface CustomError extends Error {
  status?: any
}

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../logs/product_app_error.log' })
  ],
  format: format.combine(
    format.label({
      label: `😔🥱🤧😪`
    }),
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.align(),
    format.printf(
      (error) =>
        `${error.level}: ${error.label}: ${[error.timestamp]}: ${error.message}`
    )
  )
})

export class ErrorLogger {
  async logError(
    err: CustomError,
    req?: Request,
    res?: Response
  ): Promise<void> {
    console.log('============= Start Error Logger =')
    LogErrors.error(
      `${err.status || 500} - ${res?.statusMessage} - ${err.message} - ${
        req?.originalUrl
      } - ${req?.method} - ${req?.ip}`
    )
    console.log('========= End Error Logger =')
  }
}

export const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
  const errorLogger = new ErrorLogger()
  await errorLogger.logError(err, req, res)

  const status = err?.statusCode ?? 500

  return res.status(status).json({
    message: `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  })
}
