const express = require('express');
const router = express.Router();
const spoonacularService = require('../services/spoonacularService');
const FoodItem = require('../models/FoodItem');

// Search food items in Spoonacular
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const results = await spoonacularService.searchFood(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching food', error: error.message });
    }
});

// Get nutrition information by Spoonacular ID
router.get('/:spoonacularId', async (req, res) => {
    try {
        const { spoonacularId } = req.params;
        const nutrition = await spoonacularService.getNutritionById(parseInt(spoonacularId));
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutrition', error: error.message });
    }
});

// Get nutrition for a food item from database (with cache)
router.get('/food/:foodId', async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.foodId);

        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Check if nutrition data is cached and recent (less than 7 days old)
        const cacheAge = Date.now() - new Date(foodItem.lastNutritionUpdate).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (foodItem.nutrition && cacheAge < sevenDays) {
            return res.json(foodItem.nutrition);
        }

        // Fetch fresh nutrition data if available
        if (foodItem.spoonacularId) {
            const nutrition = await spoonacularService.getNutritionById(foodItem.spoonacularId);

            // Update cache
            foodItem.nutrition = nutrition;
            foodItem.lastNutritionUpdate = Date.now();
            await foodItem.save();

            return res.json(nutrition);
        }

        // Return cached data if no Spoonacular ID
        res.json(foodItem.nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutrition', error: error.message });
    }
});

// Cache nutrition data for a food item
router.post('/cache', async (req, res) => {
    try {
        const { foodId, spoonacularId } = req.body;

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const nutrition = await spoonacularService.getNutritionById(spoonacularId);

        foodItem.spoonacularId = spoonacularId;
        foodItem.nutrition = nutrition;
        foodItem.lastNutritionUpdate = Date.now();
        await foodItem.save();

        res.json({ message: 'Nutrition data cached successfully', nutrition });
    } catch (error) {
        res.status(500).json({ message: 'Error caching nutrition', error: error.message });
    }
});

module.exports = router;
