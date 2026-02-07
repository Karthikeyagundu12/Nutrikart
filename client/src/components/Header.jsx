import { Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../assets/nutrikart-logo.png';

function Header({ cartItemCount, cartTotal, onCartClick, user, onLogout }) {
    return (
        <header className="header">
            {/* ... container ... */}
            <div className="header-container">
                <Link to={user && user.role === 'vendor' ? "/vendor/dashboard" : "/"} className="logo">
                    <img src={logoImage} alt="Nutrikart Logo" className="logo-icon" />
                    <span className="logo-text">Nutrikart</span>
                </Link>

                <nav className="nav">
                    {user && user.role === 'vendor' ? (
                        <Link to="/vendor/dashboard" className="nav-link">Vendor Dashboard</Link>
                    ) : (
                        <Link to="/" className="nav-link">Home</Link>
                    )}

                    {user ? (
                        <>
                            <span className="user-greeting">Hi, {user.name}!</span>
                            <Link to="/orders" className="nav-link">Orders</Link>
                            <button onClick={onLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link login-link">Login</Link>
                    )}

                    <div className="cart-container" onClick={onCartClick}>
                        <div className="cart-icon-wrapper">
                            <span className="cart-icon-symbol">🛍️</span>
                            {cartItemCount > 0 && (
                                <span className="cart-badge-red">{cartItemCount}</span>
                            )}
                        </div>
                        {cartTotal > 0 && <span className="cart-price">₹{cartTotal}</span>}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
