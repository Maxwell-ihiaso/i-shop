const Product = require("../models/Product");
const { validateProductData } = require("../utils/joi_data_validation");
const { verifyAccessTokenAndAdmin } = require("../utils/JWT_helper");

const router = require("express").Router();

/**
 * PRODUCT DATA IS GOTTEN FROM
 * https://data.world/crawlfeeds/groceries-dataset
 *
 * This is used to populate the DB
 */

//CREATE

router.post("/", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const productData = await validateProductData.validateAsync(req.body);
    const newProduct = new Product(productData);

    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    if (err.isJoi) err.status = 422;
    console.log("issues creating product", err);
    next(err);
  }
});

// CREATE MANY PRODUCTS

// router.post("/", verifyAccessTokenAndAdmin, async (req, res, next) => {
//   try {
//     const productData = await validateProductData.validateAsync(req.body);
//     const newProduct = new Product(productData);

//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     if (err.isJoi) err.status = 422;
//     console.log("issues creating product", err);
//     next(err);
//   }
// });

//UPDATE
router.patch("/:id", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log("issues updating product", err);
    next(err);
  }
});

//DELETE
router.delete("/:id", verifyAccessTokenAndAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(`Product with id ${req.params.id}has been deleted!`);
  } catch (err) {
    console.log("issues deleting product", err);
    next(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.log("issues fetching product", err);
    next(err);
  }
});

// //GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(3);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    console.log("issues fetching products", err);
    next(err);
  }
});

module.exports = router;
