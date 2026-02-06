import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import './Checkout.css';

function Checkout({ cart, getTotalAmount, clearCart }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        street: '',
        city: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError('Your cart is empty!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderData = {
                userId: user ? user.id || user._id : null,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                customerAddress: {
                    street: formData.street,
                    city: formData.city,
                    pincode: formData.pincode
                },
                items: cart.map(item => ({
                    foodItem: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: getTotalAmount()
            };

            const response = await createOrder(orderData);

            // Clear cart and show success
            clearCart();
            alert(`Order placed successfully! Order ID: ${response.order._id}\n\nYour order will be delivered via Cash on Delivery (COD).`);
            navigate('/');
        } catch (err) {
            setError('Failed to place order. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-empty">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some items before checking out!</p>
                <button onClick={() => navigate('/')} className="back-btn">
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="checkout">
            <div className="checkout-container">
                <div className="checkout-form-section">
                    <h1 className="checkout-title">🚚 Checkout</h1>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-group">
                            <label htmlFor="customerName">Full Name</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="customerPhone">Phone Number</label>
                            <input
                                type="tel"
                                id="customerPhone"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="street">Street Address</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                required
                                placeholder="Enter your street address"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="City"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pincode">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    placeholder="Pincode"
                                />
                            </div>
                        </div>

                        <div className="payment-info">
                            <h3>💰 Payment Method</h3>
                            <div className="payment-option">
                                <input type="radio" id="cod" name="payment" checked readOnly />
                                <label htmlFor="cod">Cash on Delivery (COD)</label>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary">
                    <h2 className="summary-title">Order Summary</h2>

                    <div className="summary-items">
                        {cart.map((item) => (
                            <div key={item._id} className="summary-item">
                                <img src={item.image} alt={item.name} className="summary-item-image" />
                                <div className="summary-item-details">
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price} × {item.quantity}</p>
                                </div>
                                <span className="summary-item-total">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-total">
                        <span>Total Amount:</span>
                        <span className="total-price">₹{getTotalAmount()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
