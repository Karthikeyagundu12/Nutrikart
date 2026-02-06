const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order (COD only)
router.post('/', async (req, res) => {
    try {
        const { userId, customerName, customerPhone, customerAddress, items, totalAmount } = req.body;

        // Validate required fields
        if (!customerName || !customerPhone || !customerAddress || !items || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const order = new Order({
            user: userId,
            customerName,
            customerPhone,
            customerAddress,
            items,
            totalAmount,
            paymentMethod: 'COD',
            orderStatus: 'pending'
        });

        await order.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get orders by User ID
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .sort({ orderDate: -1 })
            .populate('items.foodItem');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.foodItem');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

// Get all orders (for admin/testing)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 }).limit(50);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

module.exports = router;
