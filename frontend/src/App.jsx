import './App.css'
import { Link } from 'react-router-dom';
import AudioPlayer from "./components/AudioPlayer.jsx";
const API = "http://localhost:5173";
import song from "./audio/SweaterWeather.mp3"

function App() {
  const username = localStorage.getItem("username")
  console.log("username", username)


  return (
    <div>
    <h1>RZA</h1>
    <nav className='form'>
      <AudioPlayer audioSrc={song} />
    </nav>
    <div className='second-section'>
    <h2>What customers have said</h2>
    <p>"RZA has brought our family many great memories I will always cherish!"</p>
    <p>"They have helped us with so much. I cannot be any more grateful."</p>
    </div>
    </div>
  )
};


export default App;
