import { createClient } from 'redis';
import { REDIS_HOSTNAME, REDIS_PORT } from '../config';
// import createError from 'http-errors';

const host = REDIS_HOSTNAME;
const port = Number(REDIS_PORT);
// const password = REDIS_PASSWORD;

const client = createClient({
  socket: {
    host,
    port,
  },
});

client.on('connect', () => console.log('Connecting to redis cache...'));

client.on('ready', () => console.log('connected to redis cache!'));

client.on('error', (err: Error) => console.log('Redis error', err));

client.on('end', () => console.log('redis instance closed successfully!'));

process.on('SIGINT', () => client.quit());

class Store {
  constructor() {}

  async setStore(
    userId: any,
    refToken: any,
    callback: (err: Error | null, result: any) => void,
  ) {
    const key = `${userId}`;
    const value = refToken;

    await client.connect();

    await client
      .set(key, value)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));

    await client.disconnect();
  }

  async getStore(key: any, callback: (err: Error | null, result: any) => void) {
    await client.connect();

    await client
      .get(key)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));

    await client.disconnect();
  }
}

export default Store;
