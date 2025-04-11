// controllers/transactionController.js
const Order = require('../../models/orders');
const Crop = require('../models/crop');

exports.createOrder = async (req, res) => {
  try {
    const { cropId, quantity } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    if (crop.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient crop quantity' });
    }
    crop.quantity -= quantity; // Reduce the available quantity

    const totalAmount = crop.pricePerUnit * quantity;

    const Order = new Order({
      crop: cropId,
      buyer: req.user._id, // Assuming the user is a buyer
      quantity,
      totalAmount
    });

    await Order.save();
    res.status(201).json({ message: 'Transaction created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const Orders = await Order.find({ buyer: req.user._id })
      .populate('crop')
      .populate('buyer');
    res.status(200).json(Orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};
