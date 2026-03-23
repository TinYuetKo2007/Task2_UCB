import './App.css'
const API = "http://localhost:5173";
import farm_food from "./image/farm_food.jpg"

function App() {
  const username = localStorage.getItem("username")
  console.log("username", username)


  return (
    <div>
    <div className='parent-container'>
    <img src={farm_food} style={{
      width: "100vw",
    height: "600px",
    objectFit: "cover",
    filter: "brightness(50%)"
      }}/>
    <div className='bottom-left'>
      <div className='main-title'>
      <b><h1>Greenfield Local Hub</h1></b>
      <h2>Locally produced food</h2>
      </div>
    </div>
  </div>

    <div>
    <h1>About Greenfield Local Hub</h1>
    <p>We are a co-operative of local farmers and food producers in the United Kingdom. 
      We hope to offer the best locally-produced food and drinks.</p>
    <h2>By using our online App, you can:</h2>
    <ul>
      <li>Buy locally produced food, sourced from our farms</li><br/>
      <li>Learn more about the benefits of buying from local sources</li><br/>
    </ul>
    </div>
    <div className='second-section'>
    <h1>What Our Customers Say</h1>
    <h2>"Lorem ipsum"</h2>
    <p>- John Smith</p>
    </div>
    
    </div>
  )
};


export default App;
