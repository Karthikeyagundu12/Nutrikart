import './FoodItemCard.css';

function FoodItemCard({ foodItem, onAddToCart, onViewNutrition, quantity = 0, onUpdateQuantity, restaurantName }) {
    // Determine if it's veg or non-veg randomly for now (or from data if available)
    const isVeg = !['chicken', 'beef', 'pork', 'lamb', 'fish', 'egg', 'meat', 'prawn'].some(
        keyword => foodItem.name.toLowerCase().includes(keyword) ||
            foodItem.description.toLowerCase().includes(keyword)
    );

    return (
        <div className="food-item-card" onClick={() => onViewNutrition(foodItem)}>
            <div className="food-info">
                <div className="food-header">
                    <h3 className="food-name">{foodItem.name}</h3>
                    <div className={`veg-indicator ${isVeg ? 'veg' : 'non-veg'}`}>
                        <div className="dot"></div>
                    </div>
                </div>

                {restaurantName && <div className="restaurant-sub">{restaurantName}</div>}

                <div className="nutrition-info-block">
                    <div className="nutri-stat cal">
                        <span className="label">Cal</span>
                        <span className="value">{foodItem.nutrition?.calories || 250}</span>
                    </div>
                    <div className="nutri-stat protein">
                        <span className="label">Protein</span>
                        <span className="value">{foodItem.nutrition?.protein || '5g'}</span>
                    </div>
                </div>

                <div className="food-price">₹{foodItem.price}</div>
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
