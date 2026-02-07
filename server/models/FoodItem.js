const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'snack', 'side', 'starter']
  },

  // Cuisine category (Indian, Chinese, etc.)
  cuisineCategory: {
    type: String,
    enum: ['Indian', 'Chinese', 'Fast Food', 'Continental', 'South Indian', 'North Indian', 'Italian', 'Mexican', 'Beverages', 'Desserts', 'Other'],
    default: 'Other'
  },

  // Mandatory quantity/portion size
  portionSize: {
    type: String,
    required: true // e.g., "250ml", "1 plate", "200g"
  },

  // Optional ingredients list
  ingredients: {
    type: String,
    required: false
  },

  // Availability
  availabilityStatus: {
    type: String,
    enum: ['available', 'unavailable', 'out_of_stock'],
    default: 'available'
  },

  spoonacularId: {
    type: Number,
    required: false
  },

  // Weight for nutrition calculation
  weight: {
    type: Number, // in grams
    required: false
  },

  isVeg: {
    type: Boolean,
    default: true
  },

  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  lastNutritionUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
