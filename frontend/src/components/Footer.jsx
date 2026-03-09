import { Link } from "react-router-dom"
export default function Footer() {
    return (
        <footer>
        <div><p>© Riget Zoo Adventures 2026</p>
        <Link to={"/contact"}>Contact</Link>
        </div>
        </footer>
    )
}