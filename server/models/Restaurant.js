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

    // Contact details
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    // Restaurant type
    restaurantType: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Both', 'Cloud Kitchen', 'Cafe', 'Bakery'],
        required: true
    },

    // Vendor ownership
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },

    // Address details
    address: {
        street: String,
        city: String,
        pincode: String,
        fullAddress: String
    },

    // Legal documents (mandatory)
    documents: {
        restaurantLicense: String,
        gstNumber: String,
        fssaiCertificate: String,
        identityProof: String,
        bankAccountNumber: String,
        ifscCode: String,
        accountHolderName: String
    },

    // Approval status
    isApproved: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: Date,
    rejectionReason: String,

    // Operating hours
    operatingHours: {
        openingTime: String,
        closingTime: String
    },

    // Statistics
    totalOrders: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
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
