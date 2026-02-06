require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const supabase = require('./config/supabase');

const restaurantRoutes = require('./routes/restaurants');
const nutritionRoutes = require('./routes/nutrition');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Nutrikart API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        console.error('Please check your MongoDB Atlas connection string in .env file');
        process.exit(1);
    });

