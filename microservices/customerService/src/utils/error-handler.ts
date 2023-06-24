import { createLogger, transports } from 'winston'
import { NextFunction, Request, Response } from 'express'


const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../logs/customer_app_error.log' }),
  ],
})

class ErrorLogger {
  constructor() {}

  async logError(err: any): Promise<void> {
    console.log('==================== Start Error Logger ===============')
    LogErrors.log({
      private: true,
      level: 'error',
      message: `${new Date()} : ${err?.statusCode} : ${err?.name} : ${
        err?.errorStack ? err?.errorStack : err?.message
      }`,
    })
    console.log('==================== End Error Logger ===============')
  }
}

export const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorLogger = new ErrorLogger()
  await errorLogger.logError(err)

  let status = err?.statusCode ?? 500

  return res.status(status).json({ message: err.message })
}
