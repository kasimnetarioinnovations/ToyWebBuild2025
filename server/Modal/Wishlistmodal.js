const mongoose = require("mongoose");

const wishlistProductSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    old_price: { type: Number },
    new_price: { type: Number },
    level_range: {type: String },
    image: [{ url: String }],
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "products", 
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref : "users"
    },
  },
  {
    timestamps: true,
  }
);

const wishlistProductModel = mongoose.model("wishlist", wishlistProductSchema);

module.exports = wishlistProductModel;
