const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paymentRouter = express.Router();
const {paymentGatewayController} = require("../Controller/PaymentController")

paymentRouter.post("/create-checkout-session", paymentGatewayController);

module.exports = paymentRouter;