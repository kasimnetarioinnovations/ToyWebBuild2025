const express = require("express")
const addressRouter = express.Router();

const {
    addAddressItemController,
    getAddressItemController,
    updateAddressItemController,
    deleteAddressItemController
} = require("../Controller/AddressController");

addressRouter.post('/address', addAddressItemController)
addressRouter.get('/address/:userId', getAddressItemController)
addressRouter.put('/address/:addressId', updateAddressItemController)
addressRouter.delete('/address/:addressId', deleteAddressItemController)


module.exports = addressRouter;