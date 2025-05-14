const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateProfileImage,
} = require("../Controller/UserController");
const { loginUser } = require("../Controller/LoginController");
const authMiddleware = require("../authMiddleware");
const upload = require("../MiddlewaresProfileImageuploads/ProfileUploads");

userRouter.post("/register", upload.single("profileImage"), registerUser);
userRouter.get("/all", getAllUsers);
userRouter.get("/profile/:id", getUserProfile); //for single user
userRouter.put("/role/:id", updateUserRole);
userRouter.put("/profile/:id", updateUserProfile);
userRouter.put("/profileImage/:id", upload.single("profileImage"), updateProfileImage);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware);

module.exports = userRouter;
