import { useState } from 'react';
import './Hero.css';

function Hero({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('Hyderabad, India');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className="hero-section">
            <div className="hero-background">
                <div className="hero-overlay"></div>
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                    alt="Delicious Food"
                    className="hero-image"
                />
            </div>

            <div className="hero-content container">
                <div className="hero-text fade-in">
                    <h1>Hungry?</h1>
                    <p className="hero-subtitle">Order food from favourite restaurants near you.</p>
                </div>

                <div className="hero-search-container slide-up">
                    <div className="location-input-wrapper">
                        <span className="location-icon">📍</span>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="location-input"
                            placeholder="Enter your delivery location"
                        />
                        <span className="detect-location">Detect</span>
                    </div>

                    <div className="divider"></div>

                    <form onSubmit={handleSubmit} className="search-form">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for restaurant, cuisine or a dish"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">Search</button>
                    </form>
                </div>

                <div className="hero-features slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span>Fast Delivery</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🛡️</span>
                        <span>100% Safe</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">💰</span>
                        <span>Best Offers</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
