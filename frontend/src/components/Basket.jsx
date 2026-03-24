import { useBasket } from "../BasketContext";

export default function Basket() {
  const { basket, removeFromBasket, clearBasket } = useBasket();

  const handleCheckout = async () => {
    const response = await fetch(
      "http://localhost:4000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
    return <h2>Your basket is empty</h2>;

  return (
    <div className="container">
      <h1>Basket</h1>
      {basket.map(item => (
        <div key={item.id} className="basket-item">
          <img src={item.image} width="100" />
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