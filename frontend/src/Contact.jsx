import Header from "./components/Header.jsx"
import { useState } from "react";
function Dashboard(){
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
        <div>
        <div className={`form-container${isDarkMode ? "dark-mode" : ""}`}>
            <div className="form">
                <h3>You can contact us here. Feel free to drop a message.</h3>
                <h2>Harmoniq</h2>
                    <input type="email" placeholder="Your Email"/>
                    <textarea rows="4" cols="50"/><br/>
                    <button>Submit</button>
            </div>
        </div>
        </div>
    )
}

export default Dashboard;