const Order = require("../models/Order");
const { validateOrderData } = require("../utils/joi_data_validation");
const {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
} = require("../utils/JWT_helper");

const router = require("express").Router();

//CREATE

router.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const orderDatta = await validateOrderData.validateAsync(req.body);
    const newOrder = new Order(orderDatta);

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error("issues creating order", err);
    next(err);
  }
});

//UPDATE
router.patch("/:id", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("issues updating order", err);
    next(err);
  }
});

//DELETE
router.delete("/:id", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    console.error("issues deleting order", err);
    next(err);
  }
});

//GET USER ORDERS
router.get(
  "/find/:userId",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).json(orders);
    } catch (err) {
      console.error("issues fetching order", err);
      next(err);
    }
  }
);

// //GET ALL

router.get("/", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("issues fetching all orders", err);
    next(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyAccessTokenAndAdmin, async (req, res, next) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    console.error("issues aggregating monthly income", err);
    next(err);
  }
});

module.exports = router;
