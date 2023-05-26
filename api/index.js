const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const createError = require("http-errors");
const {
  authRoute,
  cartRoute,
  orderRoute,
  productRoute,
  stripeRoute,
  userRoute,
} = require("./src/routes");

dotenv.config();

// Establish connection with database

require("./src/utils/init_db");

// Establish connection with redis cache
require("./src/utils/init_redis/index");

// intialize express APP

const app = express();

if (process.env.NODE_MODE.toLowerCase() === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Valid API Routes andd handler

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

// catch for unhandled API Routes

app.use((req, res, next) => {
  next(
    createError.NotFound(`The page you are trying to access does not exist`)
  );
});

// Error Handler

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: error.status,
    message: error.message,
  });
});

app.listen(process.env.PORT || 5000, (err) => {
  if (err) return console.log(err);

  console.log("I_Shop server is running!\nCONNECTING TO DB...");
});
