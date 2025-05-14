const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {type: String, required: true},
    role: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: {type: Date},
    shopping_cart: [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'carts'
          }
        ]
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
