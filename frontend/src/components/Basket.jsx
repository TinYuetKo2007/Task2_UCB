import { useBasket } from "../BasketContext";
import { Navigate, useNavigate } from "react-router-dom";
export default function Basket() {
  const navigate = useNavigate();
  const { basket, removeFromBasket, clearBasket } = useBasket();

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const response = await fetch(
      "http://localhost:4000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: basket.map(item => ({
            priceId: item.priceId || item.priceid,
            quantity: item.quantity
          }))
        })
      }
    );
  
    const data = await response.json();
  
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Checkout error:", data.error);
    }
  };

  if (basket.length === 0)
    return (
    <div className="container">
      <button onClick={() => navigate("/products")}>Back</button>
      <h2>Your basket is empty</h2>
    </div>);

  return (
    <div className="container">
      <h1>Basket</h1>
      {basket.map(item => (
        <div key={item.id} className="basket-item">
          <img src={item.image} style={{width:"300px", height:"300px"}} />
          <p>{item.title}</p>
          <p>Price: £{item.price}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => removeFromBasket(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleCheckout}>
        Checkout Basket
      </button>
      <button onClick={clearBasket}>
        Clear Basket
      </button>
    </div>
  );
}