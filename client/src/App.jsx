import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import VendorDashboard from './pages/VendorDashboard';
import Cart from './components/Cart';
import Footer from './components/Footer';
import VendorRoute from './components/VendorRoute';
import CustomerRoute from './components/CustomerRoute';

function App() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Check for logged in user on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCart([]);
    };

    const addToCart = (foodItem) => {
        const existingItem = cart.find(item => item._id === foodItem._id);

        if (existingItem) {
            setCart(cart.map(item =>
                item._id === foodItem._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...foodItem, quantity: 1 }]);
        }
    };

    const removeFromCart = (foodItemId) => {
        setCart(cart.filter(item => item._id !== foodItemId));
    };

    const updateQuantity = (foodItemId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(foodItemId);
        } else {
            setCart(cart.map(item =>
                item._id === foodItemId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="app">
            <Header
                cartItemCount={getTotalItems()}
                cartTotal={getTotalAmount()}
                onCartClick={() => setIsCartOpen(!isCartOpen)}
                user={user}
                onLogout={handleLogout}
            />

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                getTotalAmount={getTotalAmount}
            />

            <div className="main-content">
                <Routes>
                    <Route path="/login" element={
                        user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                    } />
                    <Route path="/register" element={
                        user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
                    } />
                    <Route path="/" element={
                        <CustomerRoute>
                            <Home addToCart={addToCart} />
                        </CustomerRoute>
                    } />
                    <Route path="/restaurant/:id" element={
                        <CustomerRoute>
                            <RestaurantDetail
                                addToCart={addToCart}
                                cart={cart}
                                updateQuantity={updateQuantity}
                            />
                        </CustomerRoute>
                    } />
                    <Route path="/orders" element={
                        user ? (
                            <CustomerRoute>
                                <MyOrders user={user} />
                            </CustomerRoute>
                        ) : <Navigate to="/login" />
                    } />
                    <Route path="/checkout" element={
                        user ? (
                            <CustomerRoute>
                                <Checkout cart={cart} getTotalAmount={getTotalAmount} clearCart={clearCart} user={user} />
                            </CustomerRoute>
                        ) : <Navigate to="/login" />
                    } />

                    {/* 🔥 VENDOR ROUTES - Protected by VendorRoute */}
                    <Route path="/vendor/dashboard" element={
                        <VendorRoute>
                            <VendorDashboard />
                        </VendorRoute>
                    } />
                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default App;
