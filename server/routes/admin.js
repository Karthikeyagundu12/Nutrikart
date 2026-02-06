const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Vendor = require('../models/Vendor');

// Get all pending restaurants
router.get('/restaurants/pending', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ approvalStatus: 'pending' })
            .populate('vendor', 'ownerName email phone')
            .sort({ submittedAt: -1 });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending restaurants', error: error.message });
    }
});

// Approve restaurant
router.post('/restaurants/:id/approve', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus: 'approved',
                isApproved: true,
                approvedAt: new Date()
            },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Update vendor status
        await Vendor.findByIdAndUpdate(restaurant.vendor, {
            restaurantApproved: true,
            restaurantApprovedAt: new Date()
        });

        res.json({
            message: 'Restaurant approved successfully',
            restaurant
        });
    } catch (error) {
        res.status(500).json({ message: 'Error approving restaurant', error: error.message });
    }
});

// Reject restaurant
router.post('/restaurants/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus: 'rejected',
                isApproved: false,
                rejectionReason: reason || 'Documents verification failed'
            },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json({
            message: 'Restaurant rejected',
            restaurant
        });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting restaurant', error: error.message });
    }
});

module.exports = router;
