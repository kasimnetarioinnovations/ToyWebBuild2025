const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../Modal/Usermodal")

const resetrouter = express.Router()

resetrouter.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({message: "Invalid or expired token"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({message: "Password has been reset successfully"})
    } catch (error) {
        console.error("Reset Password Error:", error)
        res.status(500).json({message:"server error"})
    }
})

module.exports = resetrouter