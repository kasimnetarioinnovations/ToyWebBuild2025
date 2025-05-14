const mongoose = require("mongoose");
const AddressModel = require("../Modal/AddressModel");
const Usermodal = require("../Modal/Usermodal");

const addAddressItemController = async (req, res) => {
  try {
    const { userId, tag, street, city, state, phone, zip } = req.body;
    //format phone number to +91
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const newAddress = new AddressModel({
      userId: new mongoose.Types.ObjectId(userId), //this will save my userId as in object form not in string form
      tag,
      street,
      city,
      state,
      phone: formattedPhone,
      zip,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: savedAddress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding address", error });
  }
};

const getAddressItemController = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await AddressModel.find({ userId });
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: addresses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching addresses", error });
  }
};

const updateAddressItemController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updatedData = req.body;

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      updatedData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating address", error });
  }
};

const deleteAddressItemController = async (req, res) => {
  try {
    const { addressId } = req.params;
    await AddressModel.findByIdAndDelete(addressId);
    res.status(200).json({
      success: true,
      message: "Address deleted Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting address", error });
  }
};

module.exports = {
  addAddressItemController,
  getAddressItemController,
  updateAddressItemController,
  deleteAddressItemController,
};
