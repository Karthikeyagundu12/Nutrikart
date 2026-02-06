const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    // Basic Info
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    // Restaurant approval status
    hasRestaurant: {
        type: Boolean,
        default: false
    },
    restaurantApproved: {
        type: Boolean,
        default: false
    },
    restaurantSubmittedAt: Date,
    restaurantApprovedAt: Date,

    // Business Details
    gstNumber: String,
    fssaiLicense: String,

    // Status
    isApproved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Restaurants owned by this vendor
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', vendorSchema);
