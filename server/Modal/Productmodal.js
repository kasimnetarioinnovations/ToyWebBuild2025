// const { default: mongoose } = require("mongoose");
const mongoose = require('mongoose');
const schemaData = require('../Schema/Schema')

const productModal = mongoose.model("products", schemaData)

module.exports = productModal;