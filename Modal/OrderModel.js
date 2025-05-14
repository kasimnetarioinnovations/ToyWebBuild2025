const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  cartItems: { type: Array, required: true },
  amount_Total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  trackingId: {type: String},

  firstName: {type: String},
  lastName:{type: String},
  email: { type: String},
  phone1: {type: String},
  phone2: {type: String},
  address1: {type: String},
  address2: {type: String},
  city: {type: String},
  state: {type: String},
  zip: {type: String},
  cardNumber: {type: String},
  cardholderName: {type: String},
  expiryDate: {type: String},
  csv: {type: String},
  PaymentOption: { type: String},


  createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model("orders", orderSchema);
