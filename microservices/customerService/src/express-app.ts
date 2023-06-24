import express, { Express } from 'express'
import cors from 'cors'
import { log } from 'console'
// import { customer, appEvents } from './api'
// import { SubscribeMessage } from './utils'

export default async (app: Express, channel: any) => {
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
//   app.use(express.static(__dirname + '/public'))

  //api
  // appEvents(app);
log(channel)
//   customer(app, channel)
  // error handling
}
