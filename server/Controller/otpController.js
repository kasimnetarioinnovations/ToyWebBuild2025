const OtpModel = require("../Modal/OtpModel");
const twilio = require("twilio");

const accountSid = "AC01b734913803f7ab843976dd3c2fae81"; // Your Twilio SID
const authToken = "0185145a7ca42b5d41d148b01a6d1616";  // Your Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();

  try {
    const otpDocument = new OtpModel({ phoneNumber, otp });
    await otpDocument.save();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+917645905542", // Replace with your Twilio number
      to: phoneNumber,
    });

    res.send({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, userOTP } = req.body;

  try {
    const otpDocument = await OtpModel.findOne({ phoneNumber, otp: userOTP });
    if (otpDocument) {
      res.send({ success: true });
    } else {
      res.status(401).send({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Error verifying OTP" });
  }
};
