import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RestaurantCard from '../components/RestaurantCard';
import Filters from '../components/Filters';
import { getRestaurants } from '../services/api';
import './Home.css';

function Home({ addToCart }) {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        filterRestaurants(activeCategory);
    }, [restaurants, activeCategory]);

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

        const filtered = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.cuisineType.toLowerCase().includes(query.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRestaurants(filtered);
        setActiveCategory('custom'); // Reset specific category on search
    };

    const handleFilterChange = (category) => {
        setActiveCategory(category);
    };

    const filterRestaurants = (category) => {
        if (category === 'all' || category === 'custom') {
            if (category === 'all') setFilteredRestaurants(restaurants);
            return;
        }

        // This is a simple filter based on cuisine type being present in the string
        // ideally the backend would have structured categories
        const filtered = restaurants.filter(restaurant =>
            restaurant.cuisineType.toLowerCase().includes(category.toLowerCase()) ||
            // Also check if any food item in the restaurant matches? No, that's too complex for now.
            // Let's assume restaurant cuisineType covers it.
            // Additional logic for "Fast Food" vs "Burger" etc can be added here
            (category === 'Fast Food' && (restaurant.cuisineType.includes('Burger') || restaurant.cuisineType.includes('Pizza')))
        );
        setFilteredRestaurants(filtered);
    };

    return (
        <div className="home">
            <Hero onSearch={handleSearch} />

            <Filters activeFilter={activeCategory} onFilterChange={handleFilterChange} />

            <section className="restaurants-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {activeCategory === 'all' ? '🍽️ Popular Restaurants' : `🍽️ ${activeCategory} Restaurants`}
                        </h2>
                        <div className="sort-options">
                            {/* Future: Add Sort By functionality */}
                        </div>
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
                            <p>No restaurants found. Try a different search.</p>
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
