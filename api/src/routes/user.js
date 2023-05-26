const User = require("../models/User");
const Client = require("../utils/init_redis");
const {
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
} = require("../utils/JWT_helper");

const router = require("express").Router();

//UPDATE User Data

router.patch(
  "/:id",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({ updatedUser });
    } catch (err) {
      next(err);
    }
  }
);

//GET USER

router.get("/find/:id", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    console.log("issues getting unique user", err);
    next(err);
  }
});

//GET ALL USER

router.get("/", verifyAccessTokenAndAdmin, async (req, res, next) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log("issues fetching all users", err);
    next(err);
  }
});

//GET USER STATS

router.get("/stats", verifyAccessTokenAndAdmin, async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log("issues preparing stats", err);
    next(err);
  }
});

// //DELETE

router.delete(
  "/:id",
  verifyAccessTokenAndAuthorization,
  async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      Client.DEL(req.params.id, (err, val) => {
        if (err) console.error(err);
        res.status(200).json({
          status: 200,
          message: `user has been deleted... ${val}`,
        });
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
