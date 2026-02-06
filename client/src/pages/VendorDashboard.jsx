import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getVendorProfile,
    getVendorRestaurants,
    addRestaurant,
    addFoodItem,
    toggleFoodAvailability,
    getVendorOrders,
    updateOrderStatus,
    getVendorAnalytics
} from '../services/vendorApi';
import './VendorDashboard.css';

function VendorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState('check'); // check, add_restaurant, pending_approval, add_food, dashboard

    const [vendor, setVendor] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [showFoodModal, setShowFoodModal] = useState(false);

    // Restaurant form
    const [restaurantForm, setRestaurantForm] = useState({
        name: '',
        description: '',
        cuisineType: 'Indian',
        deliveryTime: '30',
        contactNumber: '',
        email: '',
        restaurantType: 'Both',
        address: {
            fullAddress: '',
            city: '',
            pincode: ''
        },
        operatingHours: {
            openingTime: '09:00',
            closingTime: '22:00'
        },
        documents: {
            restaurantLicense: '',
            gstNumber: '',
            fssaiCertificate: '',
            identityProof: '',
            bankAccountNumber: '',
            ifscCode: '',
            accountHolderName: ''
        }
    });

    // Food form
    const [foodForm, setFoodForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'main',
        isVeg: true,
        portionSize: '',
        weight: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });

    useEffect(() => {
        checkVendorStatus();
    }, []);

    const checkVendorStatus = async () => {
        try {
            const profile = await getVendorProfile();
            setVendor(profile);

            const restaurantsData = await getVendorRestaurants();
            setRestaurants(restaurantsData);

            // Determine current step
            if (restaurantsData.length === 0) {
                setCurrentStep('add_restaurant');
            } else {
                const restaurant = restaurantsData[0];
                setSelectedRestaurant(restaurant);

                if (restaurant.approvalStatus === 'pending') {
                    setCurrentStep('pending_approval');
                } else if (restaurant.approvalStatus === 'approved') {
                    setCurrentStep('add_food');
                    loadAnalytics();
                } else if (restaurant.approvalStatus === 'rejected') {
                    setCurrentStep('rejected');
                }
            }
        } catch (error) {
            console.error('Error checking status:', error);
            if (error.response?.status === 401) {
                navigate('/vendor');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            const analyticsData = await getVendorAnalytics();
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    const loadOrders = async () => {
        try {
            const ordersData = await getVendorOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const handleRestaurantSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await addRestaurant(restaurantForm);
            alert('Restaurant submitted for verification! You will be notified once approved.');
            setCurrentStep('pending_approval');
            checkVendorStatus();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Failed to submit restaurant'));
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        if (!selectedRestaurant) return;

        try {
            await addFoodItem(selectedRestaurant._id, foodForm);
            alert('Food item added successfully!');
            setShowFoodModal(false);
            checkVendorStatus();
            setFoodForm({
                name: '',
                description: '',
                price: '',
                category: 'main',
                isVeg: true,
                portionSize: '',
                weight: '',
                calories: '',
                protein: '',
                carbs: '',
                fats: ''
            });
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Failed to add food item'));
        }
    };

    const handleToggleAvailability = async (foodId) => {
        try {
            await toggleFoodAvailability(foodId);
            checkVendorStatus();
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            loadOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        navigate('/vendor');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Step 1: Add Restaurant Form
    if (currentStep === 'add_restaurant') {
        return (
            <div className="vendor-onboarding">
                <div className="onboarding-header">
                    <h1>🏪 Welcome to Nutrikart Vendor Portal</h1>
                    <p>Let's get your restaurant registered</p>
                    <button className="btn-logout-small" onClick={handleLogout}>Logout</button>
                </div>

                <div className="onboarding-container">
                    <div className="step-indicator">
                        <div className="step active">1. Restaurant Details</div>
                        <div className="step">2. Verification</div>
                        <div className="step">3. Add Menu</div>
                    </div>

                    <form onSubmit={handleRestaurantSubmit} className="restaurant-form">
                        <h2>📋 Basic Restaurant Details</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Restaurant Name *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.name}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                                    required
                                    placeholder="e.g., Spice Garden"
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number *</label>
                                <input
                                    type="tel"
                                    value={restaurantForm.contactNumber}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, contactNumber: e.target.value })}
                                    required
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email ID *</label>
                                <input
                                    type="email"
                                    value={restaurantForm.email}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                                    required
                                    placeholder="restaurant@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Restaurant Type *</label>
                                <select
                                    value={restaurantForm.restaurantType}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, restaurantType: e.target.value })}
                                    required
                                >
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                    <option value="Both">Both</option>
                                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                                    <option value="Cafe">Cafe</option>
                                    <option value="Bakery">Bakery</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                value={restaurantForm.description}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                                required
                                placeholder="Describe your restaurant..."
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Cuisine Type *</label>
                                <select
                                    value={restaurantForm.cuisineType}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisineType: e.target.value })}
                                    required
                                >
                                    <option value="Indian">Indian</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Italian">Italian</option>
                                    <option value="Mexican">Mexican</option>
                                    <option value="Continental">Continental</option>
                                    <option value="Fast Food">Fast Food</option>
                                    <option value="South Indian">South Indian</option>
                                    <option value="North Indian">North Indian</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Delivery Time (mins) *</label>
                                <input
                                    type="number"
                                    value={restaurantForm.deliveryTime}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, deliveryTime: e.target.value })}
                                    required
                                    min="15"
                                    max="120"
                                />
                            </div>
                        </div>

                        <h2>📍 Address Details</h2>

                        <div className="form-group">
                            <label>Full Address *</label>
                            <textarea
                                value={restaurantForm.address.fullAddress}
                                onChange={(e) => setRestaurantForm({
                                    ...restaurantForm,
                                    address: { ...restaurantForm.address, fullAddress: e.target.value }
                                })}
                                required
                                placeholder="Street, Area, Landmark"
                                rows="2"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.address.city}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        address: { ...restaurantForm.address, city: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.address.pincode}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        address: { ...restaurantForm.address, pincode: e.target.value }
                                    })}
                                    required
                                    pattern="[0-9]{6}"
                                />
                            </div>
                        </div>

                        <h2>🏛️ Legal Documents (Mandatory)</h2>

                        <div className="form-group">
                            <label>Restaurant License / Registration Certificate *</label>
                            <input
                                type="text"
                                value={restaurantForm.documents.restaurantLicense}
                                onChange={(e) => setRestaurantForm({
                                    ...restaurantForm,
                                    documents: { ...restaurantForm.documents, restaurantLicense: e.target.value }
                                })}
                                required
                                placeholder="License Number"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>GST Number</label>
                                <input
                                    type="text"
                                    value={restaurantForm.documents.gstNumber}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        documents: { ...restaurantForm.documents, gstNumber: e.target.value }
                                    })}
                                    placeholder="22AAAAA0000A1Z5 (if applicable)"
                                />
                            </div>
                            <div className="form-group">
                                <label>FSSAI Certificate *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.documents.fssaiCertificate}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        documents: { ...restaurantForm.documents, fssaiCertificate: e.target.value }
                                    })}
                                    required
                                    placeholder="14-digit FSSAI Number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Government-approved Identity Proof *</label>
                            <input
                                type="text"
                                value={restaurantForm.documents.identityProof}
                                onChange={(e) => setRestaurantForm({
                                    ...restaurantForm,
                                    documents: { ...restaurantForm.documents, identityProof: e.target.value }
                                })}
                                required
                                placeholder="Aadhaar / PAN / Driving License Number"
                            />
                        </div>

                        <h2>💰 Bank Account Details (For Payouts)</h2>

                        <div className="form-group">
                            <label>Account Holder Name *</label>
                            <input
                                type="text"
                                value={restaurantForm.documents.accountHolderName}
                                onChange={(e) => setRestaurantForm({
                                    ...restaurantForm,
                                    documents: { ...restaurantForm.documents, accountHolderName: e.target.value }
                                })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bank Account Number *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.documents.bankAccountNumber}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        documents: { ...restaurantForm.documents, bankAccountNumber: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>IFSC Code *</label>
                                <input
                                    type="text"
                                    value={restaurantForm.documents.ifscCode}
                                    onChange={(e) => setRestaurantForm({
                                        ...restaurantForm,
                                        documents: { ...restaurantForm.documents, ifscCode: e.target.value }
                                    })}
                                    required
                                    placeholder="e.g., SBIN0001234"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit-large">
                                ✅ Submit for Verification
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Step 2: Pending Approval
    if (currentStep === 'pending_approval') {
        return (
            <div className="vendor-onboarding">
                <div className="onboarding-header">
                    <h1>⏳ Verification in Progress</h1>
                    <button className="btn-logout-small" onClick={handleLogout}>Logout</button>
                </div>

                <div className="pending-container">
                    <div className="pending-card">
                        <div className="pending-icon">🔍</div>
                        <h2>Your restaurant is under verification</h2>
                        <p>We are reviewing your documents and details. This usually takes 24-48 hours.</p>

                        <div className="restaurant-info">
                            <h3>{selectedRestaurant?.name}</h3>
                            <p>📧 {selectedRestaurant?.email}</p>
                            <p>📱 {selectedRestaurant?.contactNumber}</p>
                            <p className="status-badge status-pending">Status: Pending Approval</p>
                        </div>

                        <div className="info-box">
                            <strong>What happens next?</strong>
                            <ul>
                                <li>Our team will verify your documents</li>
                                <li>You'll receive an email notification once approved</li>
                                <li>After approval, you can start adding food items</li>
                            </ul>
                        </div>

                        <button onClick={checkVendorStatus} className="btn-refresh">
                            🔄 Refresh Status
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Rejected
    if (currentStep === 'rejected') {
        return (
            <div className="vendor-onboarding">
                <div className="onboarding-header">
                    <h1>❌ Application Rejected</h1>
                    <button className="btn-logout-small" onClick={handleLogout}>Logout</button>
                </div>

                <div className="pending-container">
                    <div className="pending-card rejected">
                        <div className="pending-icon">❌</div>
                        <h2>Your restaurant application was rejected</h2>
                        {selectedRestaurant?.rejectionReason && (
                            <div className="rejection-reason">
                                <strong>Reason:</strong>
                                <p>{selectedRestaurant.rejectionReason}</p>
                            </div>
                        )}
                        <p>Please contact support for more information or resubmit with correct details.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Step 4 & 5: Add Food Items & Dashboard (After Approval)
    return (
        <div className="vendor-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="vendor-info">
                        <h1>🍴 {selectedRestaurant?.name}</h1>
                        <p className="approved-badge">✅ Verified Restaurant</p>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-main">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>🍽️ Menu Management</h2>
                        <button className="btn-add" onClick={() => setShowFoodModal(true)}>
                            + Add Food Item
                        </button>
                    </div>

                    {selectedRestaurant?.foodItems?.length > 0 ? (
                        <div className="food-grid">
                            {selectedRestaurant.foodItems.map(food => (
                                <div key={food._id} className={`food-card ${!food.isAvailable ? 'unavailable' : ''}`}>
                                    <div className="food-header">
                                        <span className={`veg-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
                                            {food.isVeg ? '🟢' : '🔴'}
                                        </span>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={food.isAvailable}
                                                onChange={() => handleToggleAvailability(food._id)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <h3>{food.name}</h3>
                                    <p className="food-category">{food.category}</p>
                                    <p className="food-description">{food.description}</p>
                                    <div className="food-details">
                                        <p className="food-price">₹{food.price}</p>
                                        <p className="food-portion">📏 {food.portionSize}</p>
                                    </div>
                                    {!food.isAvailable && (
                                        <div className="unavailable-overlay">
                                            <span>Unavailable</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-large">
                            <span className="empty-icon">🍽️</span>
                            <h3>No menu items yet</h3>
                            <p>Start adding food items to your menu</p>
                            <button className="btn-primary" onClick={() => setShowFoodModal(true)}>
                                Add Your First Item
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Food Modal */}
            {showFoodModal && (
                <div className="modal-overlay" onClick={() => setShowFoodModal(false)}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Food Item</h2>
                        <form onSubmit={handleAddFood}>
                            <h3>📋 Basic Details (Mandatory)</h3>

                            <div className="form-group">
                                <label>Food Item Name *</label>
                                <input
                                    type="text"
                                    value={foodForm.name}
                                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                    required
                                    placeholder="e.g., Butter Chicken"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={foodForm.description}
                                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                                    required
                                    placeholder="Describe the dish..."
                                    rows="2"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={foodForm.category}
                                        onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                                        required
                                    >
                                        <option value="starter">Starter</option>
                                        <option value="appetizer">Appetizer</option>
                                        <option value="main">Main Course</option>
                                        <option value="dessert">Dessert</option>
                                        <option value="beverage">Beverage</option>
                                        <option value="snack">Snack</option>
                                        <option value="side">Side Dish</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        value={foodForm.isVeg}
                                        onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.value === 'true' })}
                                        required
                                    >
                                        <option value="true">Veg</option>
                                        <option value="false">Non-Veg</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={foodForm.price}
                                        onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                                        required
                                        min="0"
                                        placeholder="299"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Portion Size / Quantity *</label>
                                    <input
                                        type="text"
                                        value={foodForm.portionSize}
                                        onChange={(e) => setFoodForm({ ...foodForm, portionSize: e.target.value })}
                                        required
                                        placeholder="e.g., 250ml, 1 plate, 200g"
                                    />
                                    <small>Mandatory: Specify serving size</small>
                                </div>
                            </div>

                            <h3>📊 Nutritional Information (Optional)</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Calories (kcal)</label>
                                    <input
                                        type="number"
                                        value={foodForm.calories}
                                        onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Weight (grams)</label>
                                    <input
                                        type="number"
                                        value={foodForm.weight}
                                        onChange={(e) => setFoodForm({ ...foodForm, weight: e.target.value })}
                                        placeholder="For auto-nutrition lookup"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Protein (g)</label>
                                    <input
                                        type="number"
                                        value={foodForm.protein}
                                        onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={foodForm.carbs}
                                        onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fats (g)</label>
                                    <input
                                        type="number"
                                        value={foodForm.fats}
                                        onChange={(e) => setFoodForm({ ...foodForm, fats: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowFoodModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    ✅ Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VendorDashboard;
