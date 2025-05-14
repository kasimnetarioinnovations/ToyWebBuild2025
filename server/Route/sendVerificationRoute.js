const express = require("express");
const emailRoute = express.Router();
const sendEmail = require("../test-email");

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

emailRoute.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const code = generateCode();
  const htmlContent = `<h3>Your verification code is:</h3><p style={{fontSize:'20px'; }}><b>${code}</b></p>`;

  try {
    await sendEmail(email, "your verification code", htmlContent);
    res.json({ message: "Verification code sent successfully", code });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = emailRoute;
