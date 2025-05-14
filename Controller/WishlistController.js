const mongoose = require("mongoose");
const wishlistProductModel = require("../Modal/Wishlistmodal")
const Usermodal = require("../Modal/Usermodal");
const productModal = require("../Modal/Productmodal");

const addToWishlistItemController = async (request, response) => {
  try {
    const { productId, userId } = request.body;
    // console.log('userId, productId from backend', userId, productId)

    // Validate request body
    if (!userId || !productId) {
      return response.status(400).json({
        message: "Provide both userId and productId",
        error: true,
        success: false,
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return response.status(400).json({
        message: "Invalid userId format",
        error: true,
        success: false,
      });
    }

    // Check if the user exists
    const userExists = await Usermodal.findById(userId);
    if (!userExists) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    //check if the product exists
    const product = await productModal.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await wishlistProductModel.findOne({
      userId,
      productId,
    });
    if (existingWishlistItem) {
      return response.status(400).json({
        message: "Item already in wishlist",
        error: true,
        success: false,
      });
    }

    // Add new item to wishlist
    const wishlistItem = new wishlistProductModel({
      productId,
      userId,
      title: product.title,
      subtitle: product.subtitle,
      image: product.image.map((img) => ({ url: img.url })),
      old_price: product.old_price,
      new_price: product.new_price,
      level_range: product.level_range
    });

    await wishlistItem.save();
    // console.log('prdw', product?.title)

    // Update user's wishlist array
    const updatedUser = await Usermodal.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist_item: productId } }, // Add wishlist item _id
      { new: true } // Return updated document
    );

    return response.status(200).json({
      data: wishlistItem,
      updatedUser,
      message: "Item added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

const getWishlistItemController = async (request, response) => {
  try {
    // console.log('Request query from wishlist', request.query)
    // console.log('Request body from wishlist', request.body)
    const userId = request.query.userId || request.body.userId;
    // console.log('Received userId from from wishlist ', userId)

    const wishlistItem = await wishlistProductModel
      .find({
        userId: userId,
      })
      .populate("productId", "title subtitle image old_price new_price level_range");
      // console.log('wishlist items through context', wishlistItem);

    return response.json({
      data: wishlistItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// const updateWishlistItemQtyController = async (request, response) => {
//   try {
//     const { userId } = request.body;
//     const { _id, qty } = request.body;

//     if (!_id || !qty) {
//       return response.status(400).json({
//         message: "Provide _id, qty",
//       });
//     }
//     const wishlistItem = await wishlistProductModel.findById(_id).populate("productId");
//     console.log("wishlistItem", wishlistItem);
//     if (!wishlistItem) {
//       return response.status(404).json({
//         message: "wishlist item not found",
//         error: true,
//         success: false,
//       });
//     }
//     const updateWishlistitem = await wishlistProductModel.updateOne(
//       {
//         _id: _id,
//         userId: userId,
//       },
//     );

//     return response.json({
//       message: "Update Wishlist",
//       success: true,
//       error: false,
//       data: updateWishlistitem,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

const deleteWishlistItemQtyController = async (request, response) => {
  try {
    const { userId, _id, productId } = request.body;
    // console.log("Request Body from deleteWishlistItemQtyController:", request.body);
    // console.log('userId, _id, productId deleteWishlistItemQtyController:', userId, _id, productId)  

    if (!_id || !userId || !productId) {
      return response.status(400).json({
        message: "Provide _id, userId, productId",
        error: true,
        success: false,
      });
    }
    const deleteWishlistItem = await wishlistProductModel.findByIdAndDelete(_id
      // _id: _id,
      // userId: userId,
    );
    console.log('deleteWishlistItem', deleteWishlistItem)
    if (!deleteWishlistItem) {
      return response.status(404).json({
        message: "The product in the wishlist is not found",
        error: true,
        success: false,
      });
    }


    const updatedUser = await Usermodal.findByIdAndUpdate(
      userId,
      {$pull: {wishlist_item: productId}},
      {new: true}
    );
  
    return response.json({
      message: "Item Remove from wishlist",
      error: false,
      success: true,
      data: deleteWishlistItem,
      updatedUser
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = {
  addToWishlistItemController,
  getWishlistItemController,
  // updateWishlistItemQtyController,
  deleteWishlistItemQtyController,
};
