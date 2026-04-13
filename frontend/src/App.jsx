import './App.css'
const API = "http://localhost:5173";
import veggie_field from "./image/veggie_field.jpg"

function App() {
  const username = localStorage.getItem("username")
  console.log("username", username)


  return (
    <div>
    <div className='parent-container'>
    <img src={veggie_field} style={{
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
    <h1>Freshly produced food, now available online to order.</h1>
    <h2>By using our online App, you can:</h2>
    <ul>
      <li>Buy locally produced food, sourced from our farms</li><br/>
      <li>Learn more about the benefits of buying from local sources</li><br/>
    </ul>
    </div>
    <div className="second-section">
      <h1>What Our Customers Say</h1>

      <div className="testimonial-card">
        <p className="testimonial-text">
          "The food quality is amazing and delivery is always fast. I highly recommend this service!"
        </p>

        <div className="testimonial-author">
          <span className="author-name">John Smith</span>
          <span className="author-role">Verified Customer</span>
        </div>
      </div>
    </div>
    
    </div>
  )
};


export default App;
