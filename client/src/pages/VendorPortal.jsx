import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorLogin, vendorRegister } from '../services/vendorApi';
import './VendorAuth.css';

function VendorAuth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        gstNumber: '',
        fssaiLicense: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await vendorLogin({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                await vendorRegister(formData);
            }
            navigate('/vendor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vendor-auth-page">
            <div className="vendor-auth-container">
                <div className="vendor-auth-card">
                    <div className="auth-header">
                        <h1>🍴 Vendor Portal</h1>
                        <p>{isLogin ? 'Login to manage your restaurant' : 'Join Nutrikart as a vendor'}</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label>👤 Owner Name</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>📧 Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="vendor@restaurant.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>🔒 Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label>📱 Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>🏛️ GST Number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        placeholder="22AAAAA0000A1Z5"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>🛡️ FSSAI License</label>
                                    <input
                                        type="text"
                                        name="fssaiLicense"
                                        value={formData.fssaiLicense}
                                        onChange={handleChange}
                                        placeholder="12345678901234"
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? '⏳ Please wait...' : (isLogin ? '🚀 Login' : '✨ Register')}
                        </button>
                    </form>

                    <div className="toggle-auth">
                        {isLogin ? (
                            <p>
                                New vendor? <span onClick={() => setIsLogin(false)}>Register here</span>
                            </p>
                        ) : (
                            <p>
                                Already registered? <span onClick={() => setIsLogin(true)}>Login here</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorAuth;
