const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

// Middleware to verify vendor token
// Middleware to verify vendor token - HARDENED
const verifyVendorToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // 🔥 CRITICAL SECURITY FIX: verify signature instead of just decoding
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Strict role check
        if (decoded.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Vendor only.' });
        }

        req.user = decoded; // Store full user info including role
        req.vendorId = decoded.id; // Keep backward compatibility
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Vendor Registration
router.post('/register', async (req, res) => {
    try {
        const { ownerName, email, password, phone, gstNumber, fssaiLicense } = req.body;

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create vendor
        const vendor = new Vendor({
            ownerName,
            email,
            password: hashedPassword,
            phone,
            gstNumber,
            fssaiLicense
        });

        await vendor.save();

        // Generate token
        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor' },
            process.env.JWT_SECRET || 'nutrikart_secret_key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Vendor registered successfully',
            token,
            vendor: {
                id: vendor._id,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone,
                isApproved: vendor.isApproved
            }
        });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({ message: 'Error registering vendor', error: error.message });
    }
});

// Vendor Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find vendor
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, vendor.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor' },
            process.env.JWT_SECRET || 'nutrikart_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            vendor: {
                id: vendor._id,
                ownerName: vendor.ownerName,
                email: vendor.email,
                phone: vendor.phone,
                isApproved: vendor.isApproved,
                isActive: vendor.isActive
            }
        });
    } catch (error) {
        console.error('Vendor login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Get vendor profile
router.get('/profile', verifyVendorToken, async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.vendorId)
            .select('-password')
            .populate('restaurants');

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Add Restaurant
router.post('/restaurants', verifyVendorToken, async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            cuisineType,
            deliveryTime,
            contactNumber,
            email,
            restaurantType,
            address,
            operatingHours,
            documents
        } = req.body;

        // Validate mandatory fields
        if (!name || !contactNumber || !email || !restaurantType || !documents) {
            return res.status(400).json({
                message: 'All mandatory fields are required including legal documents'
            });
        }

        // Validate documents
        if (!documents.restaurantLicense || !documents.fssaiCertificate ||
            !documents.identityProof || !documents.bankAccountNumber || !documents.ifscCode) {
            return res.status(400).json({
                message: 'All legal documents are mandatory: Restaurant License, FSSAI Certificate, Identity Proof, and Bank Details'
            });
        }

        const restaurant = new Restaurant({
            name,
            description,
            image: image || 'https://via.placeholder.com/400x300?text=Restaurant',
            cuisineType,
            deliveryTime,
            contactNumber,
            email,
            restaurantType,
            vendor: req.vendorId,
            address,
            operatingHours,
            documents,
            approvalStatus: 'pending', // Pending approval
            submittedAt: new Date()
        });

        await restaurant.save();

        // Update vendor status
        await Vendor.findByIdAndUpdate(req.vendorId, {
            $push: { restaurants: restaurant._id },
            hasRestaurant: true,
            restaurantSubmittedAt: new Date()
        });

        res.status(201).json({
            message: 'Restaurant submitted for verification. You will be notified once approved.',
            restaurant,
            approvalStatus: 'pending'
        });
    } catch (error) {
        console.error('Add restaurant error:', error);
        res.status(500).json({ message: 'Error adding restaurant', error: error.message });
    }
});

// Get vendor's restaurants
router.get('/restaurants', verifyVendorToken, async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ vendor: req.vendorId })
            .populate('foodItems');

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
});

// Add Food Item to Restaurant
router.post('/restaurants/:restaurantId/foods', verifyVendorToken, async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const {
            name,
            description,
            price,
            image,
            category,
            cuisineCategory,
            isVeg,
            weight,
            portionSize,
            ingredients,
            availabilityStatus,
            calories,
            protein,
            carbs,
            fats,
            fiber
        } = req.body;

        // Verify restaurant belongs to vendor
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            vendor: req.vendorId
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
        }

        // Check if restaurant is approved
        if (restaurant.approvalStatus !== 'approved') {
            return res.status(403).json({
                message: 'Cannot add food items. Restaurant is not yet approved.',
                approvalStatus: restaurant.approvalStatus
            });
        }

        // Validate mandatory portion size
        if (!portionSize) {
            return res.status(400).json({
                message: 'Portion size is mandatory (e.g., "250ml", "1 plate", "200g")'
            });
        }

        // Build nutrition object (optional fields)
        const nutrition = {};
        if (calories) nutrition.calories = Number(calories);
        if (protein) nutrition.protein = Number(protein);
        if (carbs) nutrition.carbs = Number(carbs);
        if (fats) nutrition.fats = Number(fats);
        if (fiber) nutrition.fiber = Number(fiber);

        const foodItem = new FoodItem({
            name,
            description,
            price,
            image: image || 'https://via.placeholder.com/300x200?text=Food',
            category,
            cuisineCategory: cuisineCategory || 'Other',
            isVeg: isVeg !== undefined ? isVeg : true,
            weight,
            portionSize,
            ingredients,
            availabilityStatus: availabilityStatus || 'available',
            nutrition: Object.keys(nutrition).length > 0 ? nutrition : undefined
        });

        await foodItem.save();

        // Add food item to restaurant
        restaurant.foodItems.push(foodItem._id);
        await restaurant.save();

        res.status(201).json({
            message: 'Food item added successfully',
            foodItem
        });
    } catch (error) {
        console.error('Add food item error:', error);
        res.status(500).json({ message: 'Error adding food item', error: error.message });
    }
});

// Update Food Item
router.put('/foods/:foodId', verifyVendorToken, async (req, res) => {
    try {
        const { foodId } = req.params;
        const updates = req.body;

        const foodItem = await FoodItem.findByIdAndUpdate(
            foodId,
            updates,
            { new: true }
        );

        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json({
            message: 'Food item updated successfully',
            foodItem
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating food item', error: error.message });
    }
});

// Toggle Food Item Availability
router.patch('/foods/:foodId/availability', verifyVendorToken, async (req, res) => {
    try {
        const { foodId } = req.params;

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        foodItem.isAvailable = !foodItem.isAvailable;
        await foodItem.save();

        res.json({
            message: 'Availability updated',
            foodItem
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability', error: error.message });
    }
});

// Get Orders for Vendor's Restaurants
router.get('/orders', verifyVendorToken, async (req, res) => {
    try {
        // Get all restaurants owned by vendor
        const restaurants = await Restaurant.find({ vendor: req.vendorId });
        const restaurantIds = restaurants.map(r => r._id);

        // Get orders for these restaurants
        const orders = await Order.find({
            'items.restaurant': { $in: restaurantIds }
        })
            .populate('user', 'name email phone')
            .populate('items.foodItem')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update Order Status
router.patch('/orders/:orderId/status', verifyVendorToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('items.foodItem');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            message: 'Order status updated',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Get Dashboard Analytics
router.get('/analytics', verifyVendorToken, async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ vendor: req.vendorId });
        const restaurantIds = restaurants.map(r => r._id);

        // Get all orders
        const orders = await Order.find({
            'items.restaurant': { $in: restaurantIds }
        });

        // Calculate analytics
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready').length;

        // Get recent orders
        const recentOrders = await Order.find({
            'items.restaurant': { $in: restaurantIds }
        })
            .populate('user', 'name')
            .populate('items.foodItem', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalOrders,
            totalRevenue,
            activeOrders,
            totalRestaurants: restaurants.length,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
});

module.exports = router;
