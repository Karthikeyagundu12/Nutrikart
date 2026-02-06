import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RestaurantCard from '../components/RestaurantCard';
import Filters from '../components/Filters'; // Keeping the cuisine filters? User might want replacement. Let's keep both or replace? Screenshot implied top filters. Let's keep existing and add new below or above. User said "i need filters... in main page also".
// Actually, the screenshot looks like it REPLACES the old horizontal filters. But let's add it below Hero.
import DishFilters from '../components/DishFilters';
import { getRestaurants } from '../services/api';
import './Home.css';

function Home({ addToCart }) {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // New Filters State
    const [activeSort, setActiveSort] = useState('default');
    const [activeNutritionFilter, setActiveNutritionFilter] = useState('all');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [restaurants, activeCategory, activeSort, activeNutritionFilter]); // Run when any filter changes

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const data = await getRestaurants();
            setRestaurants(data);
            // setFilteredRestaurants(data); // Initial filtering happens in useEffect
        } catch (err) {
            setError('Failed to load restaurants. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setActiveCategory('all');
            return;
        }

        // Search logic remains simple for now
        const filtered = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.cuisineType.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRestaurants(filtered);
        setActiveCategory('custom');
    };

    const handleFilterChange = (category) => {
        setActiveCategory(category);
    };

    const applyFilters = () => {
        let filtered = [...restaurants];

        // 1. Cuisine Category Filter
        if (activeCategory !== 'all' && activeCategory !== 'custom') {
            filtered = filtered.filter(restaurant =>
                restaurant.cuisineType.toLowerCase().includes(activeCategory.toLowerCase()) ||
                (activeCategory === 'Fast Food' && (restaurant.cuisineType.includes('Burger') || restaurant.cuisineType.includes('Pizza')))
            );
        }

        // Helper for safe parsing
        const getVal = (val, defaultVal = 0) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') return parseFloat(val.replace(/[^\d.]/g, '')) || defaultVal;
            return defaultVal;
        };

        // 2. Nutrition Filter (Filter restaurants that HAVE matching items)
        if (activeNutritionFilter !== 'all') {
            filtered = filtered.filter(restaurant => {
                const items = restaurant.foodItems || [];
                // Check if ANY item in this restaurant matches the criteria
                return items.some(item => {
                    const nutrients = item.nutrition || {};
                    // Use safe parsing
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
            });
        }

        // 3. Sort (By Price? Restaurants don't have a single price. Maybe avg price?)
        // Let's implement a simple "Cheapest item logic" for the restaurant sort?
        if (activeSort !== 'default' && activeSort !== 'relevance') {
            filtered.sort((a, b) => {
                if (activeSort === 'rating') {
                    return (b.rating || 0) - (a.rating || 0);
                }

                if (activeSort === 'delivery_time') {
                    return (parseFloat(a.deliveryTime) || 999) - (parseFloat(b.deliveryTime) || 999);
                }

                // Get min price of each restaurant
                const getMinPrice = (r) => {
                    if (!r.foodItems || r.foodItems.length === 0) return 9999;
                    return Math.min(...r.foodItems.map(i => i.price));
                };
                const priceA = getMinPrice(a);
                const priceB = getMinPrice(b);

                if (activeSort === 'price_low') return priceA - priceB;
                if (activeSort === 'price_high') return priceB - priceA;
                return 0;
            });
        }

        setFilteredRestaurants(filtered);
    };

    return (
        <div className="home">
            <Hero onSearch={handleSearch} />

            <div className="container">
                <Filters activeFilter={activeCategory} onFilterChange={handleFilterChange} />
            </div>

            <section className="restaurants-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {activeCategory === 'all' ? '🍽️ Popular Restaurants' : `🍽️ ${activeCategory} Restaurants`}
                        </h2>

                        {/* New Nutrition Filters - "In a corner" (Top Right of section) */}
                        <DishFilters
                            onFilterChange={setActiveNutritionFilter}
                            onSortChange={setActiveSort}
                        />
                    </div>

                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading delicious restaurants...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error">
                            <p>{error}</p>
                            <button onClick={fetchRestaurants} className="retry-btn">Retry</button>
                        </div>
                    )}

                    {!loading && !error && filteredRestaurants.length === 0 && (
                        <div className="no-results">
                            <p>No restaurants found matching your criteria.</p>
                        </div>
                    )}

                    {!loading && !error && filteredRestaurants.length > 0 && (
                        <div className="restaurants-grid">
                            {filteredRestaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;
