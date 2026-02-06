const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

class SpoonacularService {
    /**
     * Search for food items by name
     * @param {string} query - Food name to search
     * @param {number} number - Number of results (default: 5)
     */
    async searchFood(query, number = 5) {
        try {
            const response = await axios.get(`${BASE_URL}/food/menuItems/search`, {
                params: {
                    apiKey: SPOONACULAR_API_KEY,
                    query: query,
                    number: number
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching food:', error.message);
            throw new Error('Failed to search food items');
        }
    }

    /**
     * Get nutrition information by Spoonacular menu item ID
     * @param {number} id - Spoonacular menu item ID
     */
    async getNutritionById(id) {
        try {
            const response = await axios.get(`${BASE_URL}/food/menuItems/${id}`, {
                params: {
                    apiKey: SPOONACULAR_API_KEY
                }
            });

            return this.parseNutritionData(response.data);
        } catch (error) {
            console.error('Error fetching nutrition:', error.message);
            throw new Error('Failed to fetch nutrition information');
        }
    }

    /**
     * Parse nutrition data from Spoonacular response
     * @param {object} data - Spoonacular API response
     */
    parseNutritionData(data) {
        const nutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0
        };

        if (data.nutrition && data.nutrition.nutrients) {
            data.nutrition.nutrients.forEach(nutrient => {
                switch (nutrient.name.toLowerCase()) {
                    case 'calories':
                        nutrition.calories = Math.round(nutrient.amount);
                        break;
                    case 'protein':
                        nutrition.protein = Math.round(nutrient.amount);
                        break;
                    case 'carbohydrates':
                        nutrition.carbs = Math.round(nutrient.amount);
                        break;
                    case 'fat':
                        nutrition.fats = Math.round(nutrient.amount);
                        break;
                    case 'fiber':
                        nutrition.fiber = Math.round(nutrient.amount);
                        break;
                }
            });
        }

        return nutrition;
    }

    /**
     * Search and get nutrition for a food item by name
     * @param {string} foodName - Name of the food item
     */
    async searchAndGetNutrition(foodName) {
        try {
            const searchResults = await this.searchFood(foodName, 1);

            if (searchResults.menuItems && searchResults.menuItems.length > 0) {
                const firstResult = searchResults.menuItems[0];
                const nutrition = await this.getNutritionById(firstResult.id);

                return {
                    spoonacularId: firstResult.id,
                    nutrition: nutrition,
                    image: firstResult.image || null
                };
            }

            return null;
        } catch (error) {
            console.error('Error in searchAndGetNutrition:', error.message);
            return null;
        }
    }
}

module.exports = new SpoonacularService();
