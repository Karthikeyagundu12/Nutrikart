import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Restaurant APIs
export const getRestaurants = async () => {
    try {
        const response = await api.get('/restaurants');
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};

export const getRestaurantById = async (id) => {
    try {
        const response = await api.get(`/restaurants/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
    }
};

export const getFoodItemsByRestaurant = async (restaurantId) => {
    try {
        const response = await api.get(`/restaurants/${restaurantId}/foods`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food items:', error);
        throw error;
    }
};

// Nutrition APIs
export const getNutritionByFoodId = async (foodId) => {
    try {
        const response = await api.get(`/nutrition/food/${foodId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching nutrition:', error);
        throw error;
    }
};

export const searchFood = async (query) => {
    try {
        const response = await api.get(`/nutrition/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching food:', error);
        throw error;
    }
};

// Order APIs
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const getUserOrders = async (userId) => {
    try {
        const response = await api.get(`/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export default api;
