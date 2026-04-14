import { useBasket } from "../BasketContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import farm_food from "../image/farm_food.jpg";

export default function Basket() {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { basket, removeFromBasket, clearBasket } = useBasket();
  const [deliveryMethod, setDeliveryMethod] = useState("collection");
  const [address, setAddress] = useState("");

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert("Please login first");
        navigate("/login");
        return;
      }

      if (!basket || basket.length === 0) {
        setAlert("Basket is empty");
        return;
      }

      if (deliveryMethod === "delivery" && !address) {
        setAlert("Enter delivery address");
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/create-checkout-session",
        {
          basket,
          address,
          deliveryMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      window.location.href = res.data.url;

    } catch (err) {
      console.log("Checkout error:", err.response?.data || err.message);
    }
  };

  if (basket.length === 0)
    return (
  <div>
     <div className='parent-container'>
          <img
              src={farm_food}
              style={{
                  width: "100vw",
                  height: "170px",
                  objectFit: "cover",
                  filter: "brightness(50%)"
              }}
          />
          <div className='bottom-left'>
              <div className='main-title'>
                  <b><h2>Basket</h2></b>
              </div>
          </div>
      </div>

      <div className="basket-container" style={{ color: "#000000" }}>
        <div className="basket-actions">
          <button onClick={() => navigate("/products")}>Back</button>
        </div>
        <div className="alert-section">
        <h2>Your basket is empty</h2>
        </div>
      </div></div>
    );

  return (
    <div>
        <div className='parent-container'>
          <img
              src={farm_food}
              style={{
                  width: "100vw",
                  height: "170px",
                  objectFit: "cover",
                  filter: "brightness(50%)"
              }}
          />
          <div className='bottom-left'>
              <div className='main-title'>
                  <b><h2>Basket</h2></b>
              </div>
          </div>
      </div>
    <div className="basket-container">

      <div className="basket-actions" style={{paddingBottom: "10px"}}>
        <button onClick={() => navigate("/products")}>Back</button>
      </div>

      <div className="basket-list">
        {basket.map(item => (
          <div key={item.id} className="basket-item">
            <img src={item.image} alt={item.title} />

            <div className="basket-info">
              <h3>{item.title}</h3>
              <p>Price: £{item.price}</p>
              <p>Qty: {item.quantity}</p>

              <button onClick={() => removeFromBasket(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="delivery-options">
        <h2>Choose Order Type</h2>

        <label>
          <input
            type="radio"
            value="collection"
            checked={deliveryMethod === "collection"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
          Collection
        </label>

        <label>
          <input
            type="radio"
            value="delivery"
            checked={deliveryMethod === "delivery"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
          Delivery
        </label>

        {deliveryMethod === "delivery" && (
          <div className="delivery-address">
            <input
              type="text"
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="basket-actions">
        <button onClick={handleCheckout}>Checkout Basket</button>
        <button onClick={clearBasket}>Clear Basket</button>
      </div>
    </div></div>
  );
}