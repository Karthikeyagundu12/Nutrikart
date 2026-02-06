import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Vendor Authentication
export const vendorRegister = async (vendorData) => {
    const response = await axios.post(`${API_BASE_URL}/vendor/register`, vendorData);
    if (response.data.token) {
        localStorage.setItem('vendorToken', response.data.token);
        localStorage.setItem('vendorData', JSON.stringify(response.data.vendor));
    }
    return response.data;
};

export const vendorLogin = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/vendor/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('vendorToken', response.data.token);
        localStorage.setItem('vendorData', JSON.stringify(response.data.vendor));
    }
    return response.data;
};

export const getVendorProfile = async () => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.get(`${API_BASE_URL}/vendor/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Restaurant Management
export const addRestaurant = async (restaurantData) => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.post(`${API_BASE_URL}/vendor/restaurants`, restaurantData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getVendorRestaurants = async () => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.get(`${API_BASE_URL}/vendor/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Food Item Management
export const addFoodItem = async (restaurantId, foodData) => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.post(
        `${API_BASE_URL}/vendor/restaurants/${restaurantId}/foods`,
        foodData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const updateFoodItem = async (foodId, updates) => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.put(
        `${API_BASE_URL}/vendor/foods/${foodId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const toggleFoodAvailability = async (foodId) => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.patch(
        `${API_BASE_URL}/vendor/foods/${foodId}/availability`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Order Management
export const getVendorOrders = async () => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.get(`${API_BASE_URL}/vendor/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.patch(
        `${API_BASE_URL}/vendor/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Analytics
export const getVendorAnalytics = async () => {
    const token = localStorage.getItem('vendorToken');
    const response = await axios.get(`${API_BASE_URL}/vendor/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Nutrition API (for food items without nutrition data)
export const getNutritionByWeight = async (foodName, weight) => {
    const response = await axios.get(`${API_BASE_URL}/nutrition/search`, {
        params: { query: foodName, weight }
    });
    return response.data;
};
