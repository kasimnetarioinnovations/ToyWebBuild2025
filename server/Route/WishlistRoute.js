const express = require("express");
const wishlistRouter = express.Router();
const {
    addToWishlistItemController,
    getWishlistItemController,
    // updateWishlistItemQtyController,
    deleteWishlistItemQtyController,
} = require("../Controller/WishlistController");

wishlistRouter.post("/add", addToWishlistItemController);
wishlistRouter.get("/get", getWishlistItemController);
// wishlistRouter.put("/update-item", updateWishlistItemQtyController);
wishlistRouter.delete("/delete-wishlist-item", deleteWishlistItemQtyController);

module.exports = wishlistRouter;
