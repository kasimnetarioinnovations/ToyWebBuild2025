const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    new_price: { type: Number },
    image: [{ url: String }], 
    category: { type: String},
    
    quantity: {
      type: Number,
      default: 1
    },
    total: {
      type: Number
    },
    subTotal: {
      type: Number,
    },
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

const cartProductModel = mongoose.model("carts", cartProductSchema);

module.exports = cartProductModel;
