import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer>
        <div>© Greenfield Local Hub 2026</div>
        <div>
            <Link to={"/aboutus"}>About Us</Link>
            <Link to={"/aboutus"}>Contact</Link>
        </div>
        </footer>
    )
}