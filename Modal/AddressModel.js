const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: {
            type: mongoose.Schema.ObjectId,
            ref : "users"
        },
        tag: {type: String, default: "Home"},
        street: String,
        city: String,
        state: String,
        phone: String,
        zip: String,
})

module.exports = mongoose.model("address", addressSchema)