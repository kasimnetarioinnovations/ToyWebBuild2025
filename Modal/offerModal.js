const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  // title: { type: String},
  // description: { type: String },
  // discount: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Offer", offerSchema);
