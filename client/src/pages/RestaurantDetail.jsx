import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import NutritionModal from '../components/NutritionModal';
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

    // Filter menu items based on search
    const filteredItems = restaurant.foodItems?.filter(item =>
        item.name.toLowerCase().includes(menuSearch.toLowerCase())
    ) || [];

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

                <section className="food-category-section">
                    <h3 className="category-title">Recommended ({filteredItems.length})</h3>

                    {filteredItems.length > 0 ? (
                        <div className="food-list">
                            {filteredItems.map((foodItem) => {
                                const cartItem = cart?.find(item => item._id === foodItem._id);
                                const quantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <FoodItemCard
                                        key={foodItem._id}
                                        foodItem={foodItem}
                                        onAddToCart={addToCart}
                                        onUpdateQuantity={updateQuantity}
                                        quantity={quantity}
                                        onViewNutrition={handleViewNutrition}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <p className="no-items">No items found matching your search.</p>
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
