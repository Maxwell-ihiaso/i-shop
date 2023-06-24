const redis = require("redis");
require("dotenv").config();

const host = process.env.REDIS_HOSTNAME;
const port = process.env.REDIS_PORT;
// const password = process.env.REDIS_PASSWORD;

const client = redis.createClient({
  socket: {
    host,
    port,
  },

});



client.on("connect", () => console.log("Connecting to redis cache..."));

client.on("ready", () => console.log("connected to redis cache!"));

client.on("error", (err) => console.log("redis error", err));

client.on("end", () => console.log("redis instance closed successfully!"));

process.on("SIGINT", () => client.quit());

module.exports = client;
