import { createLogger, transports } from 'winston';
import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: any;
}

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../logs/customer_app_error.log' }),
  ],
});

export class ErrorLogger {
  constructor() {}

  async logError(err: CustomError): Promise<void> {
    console.log('==================== Start Error Logger ===============');
    LogErrors.log({
      private: true,
      level: 'error',
      message: `${new Date()} : ${err?.status} : ${err?.name} : ${
        err?.message
      } : ${err?.stack && err?.stack}`,
    });
    console.log('==================== End Error Logger ===============');
  }
}

export const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorLogger = new ErrorLogger();
  await errorLogger.logError(err);

  let status = err?.statusCode ?? 500;

  return res.status(status).json({ message: err.message });
};
