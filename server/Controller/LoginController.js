const User = require("../Modal/Usermodal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check if user exists
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "User not found!"})
        }
        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid password!"})
        }

        //Generate JWT Token (valid for an hour)
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        // console.log('token', token)

        //send user data with  token (excluding password)
        res.status(200).json({
            message: "Login successful",
            token,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });             
    } catch (error) {
        console.error("Login Error:", error)
        return res.status(500).json({message: "Server error:", error})
    }
}

module.exports = {loginUser}