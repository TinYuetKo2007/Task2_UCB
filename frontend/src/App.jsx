import './App.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import List from "./List.jsx"
import AudioPlayer from "./components/AudioPlayer.jsx";
const API = "http://localhost:5173";
import song from "./audio/SweaterWeather.mp3"

function App() {
  const username = localStorage.getItem("username")
  console.log("username", username)

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
    <div className={`${isDarkMode ? "dark-mode" : ""}`}>
    <h1>RZA</h1>
    <nav className='form'>
      <List />
      <Link to={"/products"}>Buy Ticket</Link>
      <AudioPlayer audioSrc={song} />
    </nav>
    </div>
  )
};


export default App;
