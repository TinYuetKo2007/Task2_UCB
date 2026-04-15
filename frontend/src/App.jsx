import './App.css'
const API = "http://localhost:5173";
import veggie_field from "./image/veggie_field.jpg"

import login from "./image/login.png"
import healthy_food from "./image/healthy_food.png"
import delivery from "./image/delivery.png"

export default function App() {
  const email = localStorage.getItem("email")
  console.log("email", email)


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
      <h2>Here's three easy steps to start supporting local producers like us:</h2>
      <ol>
        <li className="step">
          <img src={login} />
          <span>Create an account or log in to your profile</span>
        </li>

        <li className="step">
          <img src={healthy_food} />
          <span>Browse fresh locally produced food from nearby farms</span>
        </li>

        <li className="step">
          <img src={delivery} />
          <span>Place your order for collection or home delivery</span>
        </li>
      </ol>
    </div>

    <h1>What Our Customers Say</h1>
      <div className="testimonial-section">
      <div className="testimonial-card">
        <p className="testimonial-text">
          "The food quality is amazing and delivery is always fast. I highly recommend this service!"
        </p>

        <div className="testimonial-author">
          <span className="author-name">John Smith</span>
          <span className="author-role">Verified Customer</span>
        </div>
      </div>
      <div className="testimonial-card">
        <p className="testimonial-text">
        “The service was excellent from start to finish. My order arrived quickly and everything tasted fresh and delicious. I’ll definitely be ordering again!”
        </p>

        <div className="testimonial-author">
          <span className="author-name">Emily Johnson</span>
          <span className="author-role">Verified Customer</span>
        </div>
      </div>
    </div>
    
    </div>
  )
};
