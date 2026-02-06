import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import './MyOrders.css';

function MyOrders({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const userId = user.id || user._id;
                const data = await getUserOrders(userId);
                setOrders(data);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="spinner"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="container">
                <h1 className="page-title">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="empty-icon">🍽️</div>
                        <h2>No orders yet</h2>
                        <p>Looks like you haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/')} className="browse-btn">
                            Browse Food
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                                        <span className="order-date">
                                            {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <span className={`order-status ${order.orderStatus}`}>
                                        {order.orderStatus.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span className="item-quantity">{item.quantity}x</span>
                                            <span className="item-name">{item.name || item.foodItem?.name}</span>
                                            <span className="item-price">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span>Total Amount</span>
                                        <span className="amount">₹{order.totalAmount}</span>
                                    </div>
                                    <div className="order-actions">
                                        <button className="help-btn">Need Help?</button>
                                        <button
                                            className="reorder-btn"
                                            onClick={() => navigate('/')} // Ideally re-add items to cart
                                        >
                                            Reorder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
