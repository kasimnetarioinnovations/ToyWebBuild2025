const mongoose = require("mongoose");
const cartProductModel = require("../Modal/Cartmodal");
const Usermodal = require("../Modal/Usermodal");
const productModal = require("../Modal/Productmodal");

// const addToCartItemController = async (request, response) => {
//   try {
//     const {userId, productId } = request.body;

//     if (!productId) {
//       return response.status(402).json({
//         message: "Provide productId",
//         error: true,
//         success: false,
//       });
//     }

//     const checkItemCart = await cartProductModel.findOne({
//       userId: userId,
//       productId: productId,
//     });

//     if (checkItemCart) {
//       return response.status(400).json({
//         message: "Item already in cart",
//       });
//     }

//     const cartItem = new cartProductModel({
//       quantity: 1,
//       userId: userId,
//       productId: productId,
//     });

//     const save = await cartItem.save();

//     const updatedCartUser = await Usermodal.updateOne(
//       { _id: userId },
//       {
//         $push: {
//            shopping_cart: cartItem._id,
//         },
//       }
//     );

//     return response.status(200).json({
//       data: save,
//       message: "Item add successfully",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

const addToCartItemController = async (request, response) => {
  try {
    const { quantity, total, subTotal, productId, userId } = request.body;

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

    // Check if the product is already in the cart
    const existingCartItem = await cartProductModel.findOne({
      userId,
      productId,
    });
    if (existingCartItem) {
      return response.status(400).json({
        message: "Item already in cart",
        error: true,
        success: false,
      });
    }

    // Add new item to cart
    const cartItem = new cartProductModel({
      quantity,
      total: quantity * product.new_price,
      // subTotal: quantity * product.new_price,
      subTotal: quantity * product.new_price + (118 - 100),
      productId,
      userId,
      title: product.title,
      subtitle: product.subtitle,
      image: product.image.map((img) => ({ url: img.url })),
      new_price: product.new_price,
      category: product.category,
    });

    await cartItem.save();
    // console.log('prdw', product?.title)

    // Update user's shopping_cart array
    const updatedUser = await Usermodal.findByIdAndUpdate(
      userId,
      { $addToSet: { shopping_cart: productId } }, // Add cart item _id
      { new: true } // Return updated document
    );

    return response.status(200).json({
      data: cartItem,
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

const getCartItemController = async (request, response) => {
  // console.log('Request query from cart', request.query)
  //   console.log('Request body from cart', request.body)
  try {
    const userId = request.query.userId || request.body.userId;
    // console.log('Received userId from cart', userId)

    const cartItem = await cartProductModel
      .find({
        userId: userId,
      })
      .populate("productId", "title subtitle image new_price");
      // console.log('cart items through context', cartItem);

    return response.json({
      data: cartItem,
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

const updateCartItemQtyController = async (request, response) => {
  try {
    const { userId } = request.body;
    const { _id, qty } = request.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: "Provide _id, qty",
      });
    }
    const cartItem = await cartProductModel.findById(_id).populate("productId");
    // console.log("cartItems", cartItem);
    if (!cartItem) {
      return response.status(404).json({
        message: "cart item not found",
        error: true,
        success: false,
      });
    }
    const updateCartitem = await cartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
        total: qty * cartItem.productId.new_price,
      }
    );

    return response.json({
      message: "Update Cart",
      success: true,
      error: false,
      data: updateCartitem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//single cart controller 
const deleteCartItemQtyController = async (request, response) => {
  try {
    const { userId, _id, productId } = request.body;
    // console.log("Request Body:", request.body);
    // console.log('userId, _id, productId:', userId, _id, productId)  

    if (!_id || !userId || !productId) {
      return response.status(400).json({
        message: "Provide _id, userId, productId",
        error: true,
        success: false,
      });
    }
    const deleteCartItem = await cartProductModel.findByIdAndDelete(_id
      // _id: _id,
      // userId: userId,
    );
    if (!deleteCartItem) {
      return response.status(404).json({
        message: "The product in the cart is not found",
        error: true,
        success: false,
      });
    }

    // const user = await Usermodal.findOne({
    //   _id: userId,
    // });
    // const cartItems = user?.shopping_cart || [];
    // const updatedUserCart = [
    //   ...cartItems.slice(0, cartItems.indexOf(productId)),
    //   ...cartItems.slice(cartItems.indexOf(productId) + 1),
    // ];
    // user.shopping_cart = updatedUserCart;
    // await user.save();

    const updatedUser = await Usermodal.findByIdAndUpdate(
      userId,
      {$pull: {shopping_cart: productId}},
      {new: true}
    );
  
    return response.json({
      message: "Item Remove from cart",
      error: false,
      success: true,
      data: deleteCartItem,
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


//delete all cart item after payment  success
const clearCartController = async (req, res) => {
  try {
    const {userId} = req.body;
    if(!userId) {
      return res.status(400).json({message: 'Provide userId', error: true, success: false})
    }
  }catch(error) {
    return res.status(500).json({message: error.message || error, error: true, success: false})
  }
}

module.exports = {
  addToCartItemController,
  getCartItemController,
  updateCartItemQtyController,
  deleteCartItemQtyController,
  clearCartController
};
