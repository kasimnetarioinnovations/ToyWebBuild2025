const mongoose = require("mongoose");
const YOUR_SERVER_URL = "http://localhost:8081";
const Stripe = require("stripe")(process.env.STRIPE_SECRET);

const paymentGatewayController = async (request, response) => {
  try {
    const { products, formData } = request.body;
    // console.log("Received products:", products);

    if (!products || products.length === 0) {
      return response.status(400).json({
        message: "No product provided",
        error: true,
        success: false,
      });
    }
    const lineItems = products.map((product) => {
      const imageUrl = product.image?.[0]?.url?.startsWith("http")
        ? product.image[0].url
        : `${YOUR_SERVER_URL}${product.image?.[0]?.url}`;
      // console.log("imageUrl", imageUrl);

      // console.log("🧾 Processing product:", product); // log each product
      return {
        price_data: {
          currency: "inr",
          unit_amount: product.new_price * 100, //stripe expects price in cents
          product_data: {
            name: product.title,
            images: [imageUrl],
          },
        },
        quantity: product.quantity,
      };
    });
    lineItems.push({
      price_data: {
        currency: "inr",
        unit_amount: 1800, //18 USD -> 1800 cents (for INR, 1800 paisa = ₹18)
        product_data: {
          name: "shipping Charge",
        },
      },
      quantity: 1
    });
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      customer_email: request.body.userEmail,
      metadata: {
        cartItems:JSON.stringify(
          products.map(p => ({
            title:p.title,
            quantity:p.quantity,
            new_price:p.new_price,
            category: p.category,
            image: p.image?.[0]?.url || "",
          }))),
          formData: JSON.stringify(formData)
      }
    });
    // console.log(" Stripe session created:", session.id);
    response.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error", error.message);
    response.status(500).json({
      error: true,
      success: false,
    });
  }
};

module.exports = {
  paymentGatewayController,
};
