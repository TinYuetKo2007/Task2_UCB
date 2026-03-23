import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { searchPages } from "../main.jsx";
import SearchBar from "./SearchBar.jsx";
function Header () {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    useEffect(() => {setUsername(localStorage.getItem("username"))}, []);
    
    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/login");
    }
    const [isDarkMode, setIsDarkMode] = useState((localStorage.getItem("theme") ?? "light") === "dark");

    //  light or dark mode
    const toggleTheme = () => {
      setIsDarkMode((prevMode) => !prevMode);
      if (isDarkMode) {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      } else {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      }
    };

    return (
        <nav className={`topnav ${isDarkMode ? "dark-mode" : ""}`}>
            <div>
            <h1>GLH</h1>
            <Link to={"/"}>Main Page</Link>
            <Link to={"/products"}>Market</Link>
            <Link to={"/contact"}>Contact</Link>
            <SearchBar
        data={searchPages}
        searchKey="name"
        placeholder="Search pages..."
      />
            </div>
                {username ? <div>
                <Link to={"/profile"}>Profile</Link>
                <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <button onClick={handleLogout}> Log Out </button>
                </div> : <div>
                <Link to={"/signup"}>Sign Up</Link>
                <Link to={"/login"}>Log In</Link>
                <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>}
        </nav>

    )
}
export default Header;