const express = require("express");
const crypto = require("crypto");
const sendEmail = require("../test-email");
const User = require("../Modal/Usermodal");
const forgotrouter = express.Router();

forgotrouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const htmlContent = `<h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
            `;

    await sendEmail(email, "Password Reset", htmlContent);

    res.json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = forgotrouter;
