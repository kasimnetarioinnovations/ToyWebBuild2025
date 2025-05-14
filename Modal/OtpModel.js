const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: String,
  otp: String,
});

const OtpModel = mongoose.model("Otp", otpSchema);
module.exports = OtpModel;
