import { Navigate } from 'react-router-dom';

/**
 * Protected Route for Vendors Only
 * Redirects non-vendors to home page
 */
function VendorRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Check if user is authenticated
    if (!token || !user.id) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is a vendor
    if (user.role !== 'vendor') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default VendorRoute;
