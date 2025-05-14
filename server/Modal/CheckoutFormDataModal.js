const mongoose = require("mongoose")
const checkoutFormDataSchema = new mongoose.Schema(
    {
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
        PaymentOption: { type: String}
    }, {
        timestamps: true
    });

    module.exports = mongoose.model('checkout', checkoutFormDataSchema)