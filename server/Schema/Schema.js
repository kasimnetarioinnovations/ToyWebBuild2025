const mongoose = require("mongoose");

const schemaData = mongoose.Schema(
  {
    title: String,
    subtitle: String,
    level_range: String,
    new_price: Number,
    old_price: Number,
    category: String,
    stock: Number,
    type: String,
    primarymaterial: String,
    safetycompliance: String,
    durability: String,
    description: String,
    dimension: String,
    weight: String,
    returnpolicy: String,
    removableparts: String,
    assemblyrequired: String,
    cleaning: String,
    electronics: String,
    batteryoperated: String,
    contentinside: String,
    numberofcomponents: String,
    netqty: String,
    sku: String,
    color: String,
    target: String,
    keyfeatures: String,
    // image: [String],
    image: [
      {
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = schemaData;
