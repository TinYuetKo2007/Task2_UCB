import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchPages } from "../main.jsx";
import Dropdown from "./Dropdown.jsx";
import SearchBar from "./SearchBar.jsx";

function Header() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [isDarkMode, setIsDarkMode] = useState(
    (localStorage.getItem("theme") ?? "light") === "dark"
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
  
      if (newMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
  
      return newMode;
    });
  };

  const mobileMenuOptions = [
    { label: "Main Page", path: "/" },
    { label: "Market", path: "/products" },
    { label: "Contact", path: "/contact" },

    ...(email
      ? [
          { label: "Profile", path: "/profile" },
          { label: "Logout", path: "#logout" },
        ]
      : [
          { label: "Sign Up", path: "/signup" },
          { label: "Log In", path: "/login" },
        ]),

    { label: "Dark / Light Mode", action: "theme" },
  ];

  return (
    <nav className={`topnav ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="nav-left">
        <h1>GLH</h1>

        <div className="desktop-links">
          <Link to="/">Main Page</Link>
          <Link to="/products">Market</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="mobile-menu">
          <Dropdown title="Menu" options={mobileMenuOptions} onThemeToggle={toggleTheme} />
        </div>

        <SearchBar
          data={searchPages}
          searchKey="name"
          placeholder="Search pages..."
        />
      </div>

      {email ? (
        <div className="nav-right">
          <Link to="/profile">Profile</Link>

          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div className="nav-right">
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Log In</Link>

          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;