const authRoute = require("./auth");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const productRoute = require("./product");
const stripeRoute = require("./stripe");
const userRoute = require("./user");

module.exports = {
  authRoute,
  cartRoute,
  orderRoute,
  productRoute,
  stripeRoute,
  userRoute,
};
