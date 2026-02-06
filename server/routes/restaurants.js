const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true })
            .populate('foodItems')
            .sort({ rating: -1 });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('foodItems');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
    }
});

// Get food items for a restaurant
router.get('/:id/foods', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('foodItems');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant.foodItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food items', error: error.message });
    }
});

module.exports = router;
