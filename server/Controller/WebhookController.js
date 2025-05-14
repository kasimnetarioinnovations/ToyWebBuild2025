const Order = require("../Modal/OrderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Transaction = require("../Modal/TransactionModal");
const User = require("../Modal/Usermodal");

const saveOrderToDatabase = async (orderData) => {
  // console.log("Saving order", orderData);
  try {
    const newOrder = new Order(orderData);
    await newOrder.save();
    // console.log("Order save successfully", newOrder);

    //find user from email
    const user = await User.findOne({ email: orderData.userEmail });

    //save transaction
    const transaction = new Transaction({
      users: user?._id,
      item: `Order Payment - ${orderData.cartItems.length} items`,
      amount: orderData.amount_Total,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      products: orderData.cartItems.map((item) => ({
        title: item.title,
        new_price: item.new_price,
        quantity: item.quantity,
        category: item.category ? item.category: "unknown",
        stock: item.stock,
        dateAdded: item.date,
      })),
    });
    await transaction.save();
    // console.log("Transaction saved successfully", transaction);
  } catch (error) {
    console.error("Error saving order", error);
  }
};
// console.log(" Stripe webhook received");

const handleStripeWebhook = async (req, res) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log(" FULL Event Received:", JSON.stringify(event, null, 2));
    // console.log(" Stripe Event Received:", event);
  } catch (error) {
    console.error("webhook Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  // console.log("Event Type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const formData = session.metadata.formData
      ? JSON.parse(session.metadata.formData)
      : {};

    // console.log("SESSION DATA:", session);
    // console.log("SESSION METADATA:", session.metadata);

    // console.log("RAW cartItems from metadata:", session.metadata.cartItems);

    const orderData = {
      userEmail: session.customer_details?.email || null,
      cartItems: session.metadata.cartItems
        ? JSON.parse(session.metadata.cartItems)
        : [],
      amount_Total: session.amount_total / 100 || session.amount_subtotal || 0, // fallback if amount_total missing,
      createdAt: new Date(),
      status: "Pending",
      ...formData,
    };
    // console.log("session.metadata.cartItems", session.metadata?.cartItems);

    await saveOrderToDatabase(orderData);
  }
  res.status(200).send("Received");
};

module.exports = handleStripeWebhook;