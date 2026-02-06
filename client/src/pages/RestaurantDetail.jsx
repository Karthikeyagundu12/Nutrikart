import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import NutritionModal from '../components/NutritionModal';
import DishFilters from '../components/DishFilters';
import { getRestaurantById } from '../services/api';
import './RestaurantDetail.css';

function RestaurantDetail({ addToCart, cart, updateQuantity }) {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuSearch, setMenuSearch] = useState('');

    // Filters State
    const [activeSort, setActiveSort] = useState('default');
    const [activeNutritionFilter, setActiveNutritionFilter] = useState('all');

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            setLoading(true);
            const data = await getRestaurantById(id);
            setRestaurant(data);
        } catch (err) {
            setError('Failed to load restaurant details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewNutrition = (foodItem) => {
        setSelectedFood(foodItem);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading restaurant...</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="error-container">
                <p>{error || 'Restaurant not found'}</p>
            </div>
        );
    }

    // --- Filtering Logic ---
    let displayedItems = restaurant.foodItems || [];

    // 1. Search Filter
    if (menuSearch) {
        displayedItems = displayedItems.filter(item =>
            item.name.toLowerCase().includes(menuSearch.toLowerCase())
        );
    }

    // 2. Nutrition Filter
    if (activeNutritionFilter !== 'all') {
        displayedItems = displayedItems.filter(item => {
            const nutrients = item.nutrition || {};

            // Safe parsing helper inside the filter
            const getVal = (val, defaultVal = 0) => {
                if (typeof val === 'number') return val;
                if (typeof val === 'string') return parseFloat(val.replace(/[^\d.]/g, '')) || defaultVal;
                return defaultVal;
            };

            const cals = getVal(nutrients.calories, 999);
            const protein = getVal(nutrients.protein, 0);
            const carbs = getVal(nutrients.carbs, 999);
            const fat = getVal(nutrients.fat, 999);

            switch (activeNutritionFilter) {
                case 'low_cal': return cals < 400;
                case 'high_protein': return protein >= 20;
                case 'low_carb': return carbs < 30;
                case 'low_fat': return fat < 15;
                default: return true;
            }
        });
    }

    // 3. Sorting
    if (activeSort !== 'default' && activeSort !== 'relevance') {
        // Create a copy to sort
        displayedItems = [...displayedItems].sort((a, b) => {
            if (activeSort === 'price_low') return a.price - b.price;
            if (activeSort === 'price_high') return b.price - a.price;
            if (activeSort === 'rating') {
                // Fallback if dish rating doesn't exist
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                return ratingB - ratingA;
            }
            if (activeSort === 'delivery_time') {
                // Usually same for all dishes in a restaurant, but logically handle it
                return 0;
            }
            return 0;
        });
    }


    return (
        <div className="restaurant-detail">
            <div className="restaurant-detail-header">
                <div className="container restaurant-info-container">
                    <div className="restaurant-main-info">
                        <h1>{restaurant.name}</h1>
                        <p className="restaurant-meta">{restaurant.cuisineType}</p>
                        <p className="restaurant-meta">Hyderabad, 2.5 km</p>
                        <div className="delivery-meta">
                            <span className="meta-pill">🕒 {restaurant.deliveryTime} mins</span>
                            <span className="meta-pill">🚴 Free Delivery</span>
                        </div>
                    </div>

                    <div className="restaurant-ratings-box">
                        <span className="rating-value">★ {restaurant.rating}</span>
                        <span className="rating-count">1K+ ratings</span>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Search & Filters Section */}
                <div className="menu-controls-section">
                    <div className="menu-search-container">
                        <span className="search-icon-small">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            className="menu-search-input"
                            value={menuSearch}
                            onChange={(e) => setMenuSearch(e.target.value)}
                        />
                    </div>

                    <DishFilters
                        onFilterChange={setActiveNutritionFilter}
                        onSortChange={setActiveSort}
                    />
                </div>

                <section className="food-category-section">
                    <h3 className="category-title">
                        Recommended ({displayedItems.length})
                    </h3>

                    {displayedItems.length > 0 ? (
                        <div className="food-list">
                            {displayedItems.map((foodItem) => {
                                const cartItem = cart?.find(item => item._id === foodItem._id);
                                const quantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <FoodItemCard
                                        key={foodItem._id}
                                        foodItem={foodItem}
                                        restaurantName={restaurant.name}
                                        onAddToCart={addToCart}
                                        onUpdateQuantity={updateQuantity}
                                        quantity={quantity}
                                        onViewNutrition={handleViewNutrition}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-items-placeholder">
                            <p>No items found matching your filters.</p>
                            <button
                                className="clear-filters-link"
                                onClick={() => {
                                    setMenuSearch('');
                                    setActiveNutritionFilter('all');
                                    setActiveSort('default');
                                }}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <NutritionModal
                foodItem={selectedFood}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default RestaurantDetail;
