const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email Sent:", info.response);
  } catch (error) {
    console.error("EMAIL SEND ERROR", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
