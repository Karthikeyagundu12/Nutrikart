
function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <span className="logo-icon">🍔</span>
                            <span className="logo-text">Nutrikart</span>
                        </div>
                        <p className="footer-desc">
                            Delicious food delivery with complete nutrition transparency. Know what you eat!
                        </p>
                        <div className="social-icons">
                            <span>🐦</span>
                            <span>📸</span>
                            <span>📘</span>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Team</li>
                            <li>Careers</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li>Help & Support</li>
                            <li>Partner with us</li>
                            <li>Ride with us</li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Nutrikart Technologies Pvt. Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
