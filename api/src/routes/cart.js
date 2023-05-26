const Cart = require("../models/Cart");
const { validateCartData } = require("../utils/joi_data_validation");
const {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
} = require("../utils/JWT_helper");

const router = require("express").Router();

// //CREATE

router.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const cartData = await validateCartData.validateAsync(req.body);
    const newCart = new Cart(cartData);

    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    if (err.isJoi) err.status = 422;
    console.error("issues creating cart", err);
    next(err);
  }
});

//UPDATE

router.patch(
  "/:id",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      console.error("issues updating cart", err);
      next(err);
    }
  }
);

// //DELETE

router.delete(
  "/:id",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      console.error("issues deleting cart", err);
      next(err);
    }
  }
);

// //GET USER CART

router.get(
  "/find/:userId",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      console.error("issues fetching cart", err);
      next(err);
    }
  }
);

//GET ALL

router.get("/", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    console.error("issues fehing all cart", err);
    next(err);
  }
});

module.exports = router;
