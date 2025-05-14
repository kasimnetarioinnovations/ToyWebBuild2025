const express = require("express");
const orderrouter = express.Router();
const {getUserOrders, getAllOrders, updatedOrderStatus} = require("../Controller/orderController");
const Order = require("../Modal/OrderModel");

//all orders for admin
orderrouter.get("/all-orders", getAllOrders)

//get all orders for a user by user email
orderrouter.get("/orders", getUserOrders);

//update order status by admin
orderrouter.put("/update-order/:id", updatedOrderStatus)

//get a single order by Id for delivery progress
orderrouter.get("/order-details/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    // console.log('Fetching order with ID:', req.params.id || req.body.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal error" });

  }
});
module.exports = orderrouter;
