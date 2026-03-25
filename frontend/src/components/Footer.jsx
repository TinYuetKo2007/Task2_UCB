import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-left">
                    <h3>Greenfield Local Hub</h3>
                    <p>© 2026 Greenfield Local Hub</p>
                </div>

                <div className="footer-links">
                    <h4>Company</h4>
                    <Link to="/aboutus">About Us</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="footer-links">
                    <h4>Market</h4>
                    <Link to="/products">Browse Products</Link>
                </div>

            </div>

            <div className="footer-bottom">
                Images from Freepik and Flaticon
            </div>
        </footer>
    );
}