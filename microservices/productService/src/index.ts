import express from 'express'

import { dbConn } from './database'
import { expressApp } from './express-app'
import { ENVIRONMENT, PORT } from './config'
import { ErrorLogger } from './utils/error-handler'

const startServer = async () => {
  const app = express()
  const logger = new ErrorLogger()

  await dbConn()

  expressApp(app)

  app
    .listen(PORT, async () => {
      console.log(`${ENVIRONMENT} environment started`)
      console.log(`Product Service is listening to port ${PORT}`)
    })
    .on('error', async (err) => {
      await logger.logError(err)
      process.exit()
    })
    .on('close', () => {
      console.log('Server stopped')
      // channel.close()
    })
}
void startServer()
