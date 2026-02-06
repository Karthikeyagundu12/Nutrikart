import { useNavigate } from 'react-router-dom';
import './RestaurantCard.css';

function RestaurantCard({ restaurant }) {
    const navigate = useNavigate();

    // Mock offer data for demonstration
    const offers = [
        "50% OFF up to ₹100",
        "Flat ₹150 OFF",
        "Free Delivery"
    ];

    // Random offer selection
    const offer = offers[Math.floor(Math.random() * offers.length * 1.5)];

    const handleClick = () => {
        navigate(`/restaurant/${restaurant._id}`);
    };

    return (
        <div className="restaurant-card" onClick={handleClick}>
            <div className="card-image-container">
                <img
                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop"}
                    alt={restaurant.name}
                    className="card-image"
                />
                {offer && (
                    <div className="card-offer">
                        <span className="offer-icon">🏷️</span>
                        <span className="offer-text">{offer}</span>
                    </div>
                )}
                <div className="delivery-time-badge">
                    {restaurant.deliveryTime} mins
                </div>
            </div>

            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{restaurant.name}</h3>
                    <span className="card-rating">
                        <span className="star">★</span> {restaurant.rating}
                    </span>
                </div>

                <div className="card-details">
                    <p className="card-cuisine">{restaurant.cuisineType}</p>
                    <p className="card-location">Hyderabad</p>
                </div>

                <div className="card-divider"></div>

                <div className="card-footer">
                    <span className="safety-badge">
                        <span className="safety-icon">🛡️</span> MAX SAFETY
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RestaurantCard;
