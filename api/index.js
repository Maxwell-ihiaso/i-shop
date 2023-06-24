const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
dotenv.config();

const {
  authRoute,
  cartRoute,
  orderRoute,
  productRoute,
  stripeRoute,
  userRoute,
} = require("./src/routes");

const PORT = process.env.PORT || 5000


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
app.use(cookieParser())

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

app.listen(PORT , (err) => {
  if (err) return console.log(err);

  console.log(`I_Shop server is runningon port ${PORT}!\nCONNECTING TO DB...`);
});
