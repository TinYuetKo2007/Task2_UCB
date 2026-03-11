import './App.css'
import { Link } from 'react-router-dom';
import AudioPlayer from "./components/AudioPlayer.jsx";
const API = "http://localhost:5173";
import song from "./audio/SweaterWeather.mp3"
import zoo2 from "./image/zoo2.jpeg"
function App() {
  const username = localStorage.getItem("username")
  console.log("username", username)


  return (
    <div>
    <div className='parent-container'>
    <img src={zoo2} style={{width: "100%"}}/>
    <div className='bottom-left'>
      <div className='main-title'>
      <b><h1>Riget Zoo Adventures</h1></b>
      <h2>Explore the Wild with Us</h2>
      </div>
    </div>
      
</div>

    <div className='second-section'>
    <h2>What customers have said</h2>
    <p>"RZA has brought our family many great memories I will always cherish!"</p>
    <p>"They have helped us with so much. I cannot be any more grateful."</p>
    </div>
    <nav className='form'>
      <AudioPlayer audioSrc={song} />
    </nav>
    
    </div>
  )
};


export default App;
