const nodemailer = require("nodemailer");

const sendOrderConfirmation = async (toEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // replace with your email
        pass: process.env.EMAIL_PASS, // replace with app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Order Confirmation",
      text: "Your order has been placed successfully!",
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendOrderConfirmation;