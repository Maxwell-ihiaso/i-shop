import express, { Express } from 'express'

import { ENVIRONMENT, PORT } from './config'
import expressApp from './express-app'
import { dbConn } from './database'
// import { CreateChannel } from './utils'

const StartServer = async () => {
  const app: Express = express()

  await dbConn()

//   const channel = await CreateChannel()

  await expressApp(app, "channel")

  app
    .listen(PORT, () => {
      console.log(`${ENVIRONMENT} environment started`)
      console.log(`listening to port ${PORT}`)
    })
    .on('error', (err) => {
      console.log(err)
      process.exit()
    })
    // .on('close', () => {
    //   channel.close()
    // })
}

StartServer()
