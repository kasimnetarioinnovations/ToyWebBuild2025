const mongoose = require("mongoose");
const targetSchema = new mongoose.Schema(
  {
    target: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("targets", targetSchema);