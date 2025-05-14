const jwt = require("jsonwebtoken")
const User = require("./Modal/Usermodal")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  //verify token
        const user = await User.findById(decoded.id).select("-password"); //find user & exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        req.user = user; //attach user info to request
        next(); //proceed to next middleware or route
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
};

module.exports = authMiddleware;