const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: { type: String, required: true },
    categories: { type: Array },
    // size: { type: Array },
    // color: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    brand: { type: String, default: "Generic" },
    sku: { type: Number, required: true },
    currency: { type: String, required: true },
    specifications: { type: String, required: true },
    highlights: { type: String, required: true },
    main_image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
