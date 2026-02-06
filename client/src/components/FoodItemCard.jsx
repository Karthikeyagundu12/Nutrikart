import './FoodItemCard.css';

function FoodItemCard({ foodItem, onAddToCart, onViewNutrition, quantity = 0, onUpdateQuantity }) {
    // Determine if it's veg or non-veg randomly for now (or from data if available)
    // Usually this would come from the backend. Let's assume description or name gives a hint, otherwise random
    const isVeg = !['chicken', 'beef', 'pork', 'lamb', 'fish', 'egg', 'meat'].some(
        keyword => foodItem.name.toLowerCase().includes(keyword) ||
            foodItem.description.toLowerCase().includes(keyword)
    );

    return (
        <div className="food-item-card">
            <div className="food-info">
                <div className={`veg-indicator ${isVeg ? 'veg' : 'non-veg'}`}>
                    <div className="dot"></div>
                </div>

                <h3 className="food-name">{foodItem.name}</h3>
                <div className="food-price">₹{foodItem.price}</div>

                <p className="food-description">{foodItem.description}</p>

                <div className="nutrition-tag" onClick={() => onViewNutrition(foodItem)}>
                    <span className="calories-badge">
                        🔥 {foodItem.nutrition?.calories || 250} cal
                    </span>
                    <span className="view-more">View info ›</span>
                </div>
            </div>

            <div className="food-image-wrapper">
                <img
                    src={foodItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"}
                    alt={foodItem.name}
                    className="food-image"
                />
                <div className="add-btn-container">
                    {quantity > 0 ? (
                        <div className="quantity-controls">
                            <button
                                className="qty-btn minus"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateQuantity(foodItem._id, quantity - 1);
                                }}
                            >
                                −
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                className="qty-btn plus"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(foodItem);
                                }}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button className="add-btn" onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(foodItem);
                        }}>
                            ADD <span className="plus">+</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodItemCard;
