const User = require("../Modal/Usermodal");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path")

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    //check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage,
    });
    await user.save();
    return res.status(201).json({ message: "User register successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//get user controller
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log("Fetching profile for ID:", req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); //exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

//update user role
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({ message: "Role updated", user });
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

//update user
const updateUserProfile = async (req, res) => {
  const { name, email, currentpassword, newpassword, confirmpassword } =
    req.body;
  // console.log("ilhlihlijhol", currentpassword, newpassword, confirmpassword);

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    //verify current password before making changes
    if (newpassword || confirmpassword) {
      if (!currentpassword) {
        return res.status(404).json({
          message: "Current password is required to change the password",
        });
      }
      const isMatch = await bcrypt.compare(currentpassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newpassword !== confirmpassword) {
        return res.status(404).json({ message: "New passwords do not match" });
      }
      user.password = await bcrypt.hash(newpassword, 10);
    }
    if (name) user.name = name;
    if (email) user.email = email;
    // console.log("New hashed password:", user.password);

    const updatedUser = await user.save();
    res.json({
      message: "Profile  updated successfully",
      updated: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
//update profileImage
const updateProfileImage = async (req, res) => {
  const userId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const oldImage = user.profileImage;
    const newImageName = req.file.filename;
    user.profileImage = newImageName;
    await user.save();
    // console.log("Saved new image to user:", user);

    //delete old image
    if (oldImage) {
      const oldImagePath = path.join(__dirname, "..", "profileImage", oldImage);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete oldImage:", err);
        } else {
          // console.log("Image deleted", oldImage);
        }
      });
    }
    res.status(200).json({
      message: "Profile image updated success",
      profileImage: newImageName,
    });
  } catch (error) {
    console.error("Error updating profile image", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
//delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "user deleted" });
  } catch (error) {
    console.error("Error while deleteing user", error);
  }
};
module.exports = {
  registerUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
  updateUserRole,
  deleteUser,
};
