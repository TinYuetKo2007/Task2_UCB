import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer>
            <div className="footer-row-section">
                <div>© Greenfield Local Hub 2026</div>
                <div className="footer-column-section">
                    <Link to={"/aboutus"}>About Us</Link>
                    <Link to={"/contact"}>Contact</Link>
                </div>
            </div>
            <div>Images from Freepik</div>
        </footer>
    )
}