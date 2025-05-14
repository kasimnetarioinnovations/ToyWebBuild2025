const express = require("express");
const cartRouter = express.Router();
const {
  addToCartItemController,
  getCartItemController,
  updateCartItemQtyController,
  deleteCartItemQtyController,
  clearCartController,
} = require("../Controller/CartController");

cartRouter.post("/add", addToCartItemController);
cartRouter.get("/get", getCartItemController);
cartRouter.put("/update-qty", updateCartItemQtyController);
cartRouter.delete("/delete-cart-item", deleteCartItemQtyController);
cartRouter.delete("/clear-cart", clearCartController)

module.exports = cartRouter;
