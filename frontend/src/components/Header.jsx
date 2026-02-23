import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
function Header () {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    useEffect(() => {setUsername(localStorage.getItem("username"))}, []);
    
    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div>
            <nav className="topnav">
                <div>
                <Link to={"/"}>Main Page</Link>
                <Link to={"/add-song"}>Upload Page</Link>
                <Link to="/products">Tickets/Booking</Link>
                <Link to={"/contact"}>Contact</Link>
                
                </div>
                 {username ? <div>
                 <Link to={"/notes"}>Notes</Link>
                 <button onClick={handleLogout}> Log Out </button>
                 </div> : <div>
                    <Link to={"/signup"}>Sign Up</Link>
                    <Link to={"/login"}>Log In</Link>
                </div>}
            </nav>
        </div>
    )
}
export default Header;