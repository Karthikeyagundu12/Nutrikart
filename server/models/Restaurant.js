const mongoose = require('mongoose');
const FoodItem = require('./FoodItem');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    cuisineType: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.0
    },
    deliveryTime: {
        type: String,
        required: true
    },
    foodItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
