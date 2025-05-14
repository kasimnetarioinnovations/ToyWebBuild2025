const express = require("express");
const webRouter = express.Router();
// const bodyParser = require('body-parser');
const handleStripeWebhook = require("../Controller/WebhookController")


webRouter.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = webRouter;




