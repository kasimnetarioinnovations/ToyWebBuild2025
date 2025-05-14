const express = require('express')
const transactionrouter = express.Router();
const {getAllTransactions} = require('../Controller/TransactionController')


transactionrouter.get("/all", getAllTransactions)

module.exports = transactionrouter;