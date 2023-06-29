import { createLogger, transports } from 'winston'
import { type NextFunction, type Request, type Response } from 'express'

interface CustomError extends Error {
  status?: any
}

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../logs/customer_app_error.log' })
  ]
})

export class ErrorLogger {
  async logError(err: CustomError): Promise<void> {
    console.log('==================== Start Error Logger ===============')
    LogErrors.log({
      level: 'error',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `${new Date().toLocaleTimeString()} : ${err?.status} : ${
        err?.name
      } : ${
        err?.message
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      }`
      //  : ${((err?.stack) != null) && err?.stack}`
    })
    console.log('==================== End Error Logger ===============')
  }
}

export const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
  const errorLogger = new ErrorLogger()
  await errorLogger.logError(err)

  const status = err?.statusCode ?? 500

  return res.status(status).json({ message: err.message })
}
