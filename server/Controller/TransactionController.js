const Transaction = require('../Modal/TransactionModal')
const  User = require('../Modal/Usermodal')

//controller to fetch all transactions with user info
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('users', 'name profileImage', 'categories').sort({createdAt: -1})
        res.json(transactions)
    }catch(error) {
        console.error('Error fetching transaction', error)
        res.status(500).json({message: 'Failed to fetch transaction'})
    }
}

module.exports = {
    getAllTransactions
}