const Order = require("../Modal/OrderModel");

const getUserOrders = async (req, res) => {
  try {
    const { email } = req.query;
    // console.log("useremail in backend", email);
    if (!email) return res.status(404).json({ message: "Email is required" });

    const orders = await Order.find({ userEmail: email }).sort({
      createdAt: -1,
    });
    // console.log("order found:", orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json("Internal server error", error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const updatedOrderStatus = async (req, res) => {
//   const {id} = req.params;
//   const {status} = req.body;
//   console.log('id and status', id, status)
//   try {
//    const order = await Order.findById(id)
//    if(!order) {
//     return res.status(404).json({message:"Order not found"})
//    }
//    //update status
//    order.status = status || order.status;
//    await order.save();
//    res.status(200).json({message: 'Order status updated', order})
//   }catch(error) {
//     console.error("Error updating order:", error)
//     res.status(500).json({message: "Internal server error"})
//   }
// }

const updatedOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, trackingId } = req.body;
  // console.log("id and status", id, status);
  try {
    const order = await Order.findByIdAndUpdate(id, { status, trackingId }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    //if the order is dispatched, sent to google sheet
    if (status === "Dispatch" && !trackingId) {
      return res.status(400).json({message: "Tracking ID is required for dispatched orders"})
    }
    //update status
    order.status = status || order.status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserOrders,
  getAllOrders,
  updatedOrderStatus,
};
