import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
function Header () {
    const [username, setUsername] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
    
      window.addEventListener("resize", handleResize);
    
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {setUsername(localStorage.getItem("username"))}, []);
    
    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/login");
    }
    const [isDarkMode, setIsDarkMode] = useState(false);

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
    {isMobile ? (
      <Dropdown
        title="Menu"
        options={[
          { label: "Main Page", path: "/" },
          { label: "Upload Page", path: "/add-song" },
          { label: "Tickets/Booking", path: "/products" },
          { label: "Contact", path: "/contact" },
        ]}
      />
    ) : (
      <div>
        <Link to={"/"}>Main Page</Link>
        <Link to={"/add-song"}>Upload Page</Link>
        <Link to="/products">Tickets/Booking</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>
    )}

    {/* Right side buttons */}
    {username ? (
      <div>
        <Link to={"/notes"}>Notes</Link>
        <button onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    ) : (
      <div>
        <Link to={"/signup"}>Sign Up</Link>
        <Link to={"/login"}>Log In</Link>
        <button onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    )}
  </nav>
);
}
export default Header;