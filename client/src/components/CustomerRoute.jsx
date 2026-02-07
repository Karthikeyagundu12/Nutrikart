import { Navigate } from 'react-router-dom';

/**
 * Protected Route for Customers Only
 * Redirects vendors to their dashboard
 */
function CustomerRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Check if user is authenticated (Optional - allow guests for public pages)
    // If we want to force login for protected customer routes, we can handle that in App.jsx
    // Here we mainly want to ensure VENDORS cannot access customer routes


    // Redirect vendors to their dashboard
    if (user.role === 'vendor') {
        return <Navigate to="/vendor/dashboard" replace />;
    }

    return children;
}

export default CustomerRoute;
