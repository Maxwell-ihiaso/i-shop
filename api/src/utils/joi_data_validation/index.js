const Joi = require("joi");

const validateUserData = Joi.object({
  name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().lowercase().required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .options({ messages: { allowOnly: "must match password" } }),
  isAdmin: Joi.boolean(),
  img: Joi.string(),
});

const validateProductData = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.string().required(),
  categories: Joi.array().items(Joi.string()),
  // size: Joi.array().items(Joi.string()),
  // color: Joi.array().items(Joi.string()),
  price: Joi.number().required(),
  inStock: Joi.boolean(),
  brand: Joi.string(),
  sku: Joi.number().required(),
  currency: Joi.string().required(),
  specifications: Joi.string().required(),
  highlights: Joi.string().required(),
  main_image: Joi.string().required(),
});

// const validateProductsData = Joi.array().items(
//   Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     images: Joi.string().required(),
//     categories: Joi.array().items(Joi.string()),
//     size: Joi.array().items(Joi.string()),
//     color: Joi.array().items(Joi.string()),
//     price: Joi.number().required(),
//     inStock: Joi.boolean(),
//     brand: Joi.string(),
//     sku: Joi.number().required(),
//     currency: Joi.string().required(),
//     specifications: Joi.string().required(),
//     highlights: Joi.string().required(),
//   })
// );

const validateOrderData = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string(),
      quantity: Joi.number(),
    })
  ),
  amount: Joi.number().required(),
  address: Joi.object().pattern(/^/, [
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.object().pattern(/^/, [Joi.string(), Joi.number(), Joi.boolean()]),
  ]),
  status: Joi.string(),
});

const validateCartData = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string(),
      quantity: Joi.number(),
    })
  ),
});

module.exports = {
  validateUserData,
  validateProductData,
  validateOrderData,
  validateCartData,
  // validateProductsData,
};
