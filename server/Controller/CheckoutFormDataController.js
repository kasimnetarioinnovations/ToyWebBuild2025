const mongoose = require("mongoose")
const CheckoutFormDataModal = require("../Modal/CheckoutFormDataModal");
const sendOrderConfirmation = require("../sendOrderconfirmmail/SendEmail");



const addToCheckoutFormData = async (req, res) => {
    try {
     const userData = req.body;
     const newCheck = new CheckoutFormDataModal(userData);
     await newCheck.save();

     const email = userData.email; //extract email
     await sendOrderConfirmation(email);

     res.status(200).json({message: 'Checkout form data saved successfully', data: newCheck})
    }catch(error) {
        console.error('Failed to saved checkoutdata in server', error);
        res.status(500).json({message: 'Server error while saving checkoutformdata'})
    }
}

//get checkoutformdatacontroller
const getCheckoutFormData = async (req, res) => {
    try {
     const checkoutdata = await CheckoutFormDataModal.find();
     res.status(200).json({checkoutdata}) 
    }catch(error) {
        res.status(500).json({message: "Server error", error})
    }

} 

module.exports = {
    addToCheckoutFormData,
    getCheckoutFormData
};
