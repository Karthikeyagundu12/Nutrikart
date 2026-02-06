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
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'snack', 'side']
  },
  spoonacularId: {
    type: Number,
    required: false
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
