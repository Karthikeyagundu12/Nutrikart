import './Cart.css';

function Cart({ isOpen, onClose, cart, updateQuantity, removeFromCart, getTotalAmount }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="cart-overlay fade-in" onClick={onClose}></div>
            <div className="cart-drawer slide-in-right">
                <div className="cart-header">
                    <h2>Your Orders</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-img">🥡</div>
                            <h3>Your cart is empty</h3>
                            <p>Go ahead, order some yummy food from the menu.</p>
                            <button className="btn btn-primary" onClick={onClose}>See Restaurants</button>
                        </div>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className={`veg-indicator-small ${item.isVeg ? 'veg' : 'non-veg'}`}>
                                            <div className="dot"></div>
                                        </div>
                                        <div>
                                            <h4>{item.name}</h4>
                                            <p className="item-price">₹{item.price}</p>
                                        </div>
                                    </div>

                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="qty-btn minus"
                                        >−</button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="qty-btn plus"
                                        >+</button>
                                    </div>

                                    <div className="item-total">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}

                            <div className="bill-details">
                                <h3>Bill Details</h3>
                                <div className="bill-row">
                                    <span>Item Total</span>
                                    <span>₹{getTotalAmount()}</span>
                                </div>
                                <div className="bill-row">
                                    <span>Delivery Fee</span>
                                    <span>₹40</span>
                                </div>
                                <div className="bill-row">
                                    <span>Platform Fee</span>
                                    <span>₹5</span>
                                </div>
                                <div className="bill-row">
                                    <span>GST and Restaurant Charges</span>
                                    <span>₹{(getTotalAmount() * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="bill-divider"></div>
                                <div className="bill-row total">
                                    <span>To Pay</span>
                                    <span>₹{(getTotalAmount() + 45 + (getTotalAmount() * 0.05)).toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-info">
                            <span className="total-label">Total</span>
                            <span className="total-amount">₹{(getTotalAmount() + 45 + (getTotalAmount() * 0.05)).toFixed(2)}</span>
                        </div>
                        <a href="/checkout" className="checkout-btn">
                            Proceed to Pay
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}

export default Cart;
