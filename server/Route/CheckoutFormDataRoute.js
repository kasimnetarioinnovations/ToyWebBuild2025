const express = require('express')
const checkoutformrouter = express.Router();
const {addToCheckoutFormData, getCheckoutFormData} = require("../Controller/CheckoutFormDataController");

checkoutformrouter.post("/post", addToCheckoutFormData);
checkoutformrouter.get("/get", getCheckoutFormData)

module.exports = checkoutformrouter;