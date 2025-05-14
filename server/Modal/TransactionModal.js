const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    
    item: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    products: [
      {
        title: String,
        new_price: Number,
        quantity: Number,
        stock: Number,
        category: {
          type: String,
          required: true,
        },
        dateAdded: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
