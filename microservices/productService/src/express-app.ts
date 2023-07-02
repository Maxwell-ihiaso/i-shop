import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { ErrorHandler } from './utils/error-handler'
import { productAPI } from './api/product-api'

export const expressApp = (app: Express) => {
  app.use(cors())
  app.use(morgan('dev'))
  app.use(cookieParser())

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // api
  productAPI(app)

  app.use(ErrorHandler)
}
