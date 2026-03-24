import { useBasket } from "../BasketContext";

export default function ProductDisplay({ product }) {

  const { addToBasket } = useBasket();
  const handleBuyNow = async () => {
    const response = await fetch(
      "http://localhost:4000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [
            {
              priceId: product.priceId,
              quantity: 1
            }
          ]
        })
      }
    );
  
    const data = await response.json();
  
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error(data.error);
    }
  };

  return (
    <div className="container">
    <div className="form-container">
      <img src={product.image} alt={product.title} />
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <h2>£{product.price}</h2>

      <div style={{ display: "flex", gap: "10px" }}>

      <button onClick={handleBuyNow}>
        Buy Now
      </button>

      <button
        type="button"
        onClick={() => 
          {console.log("Adding product:", product);
            addToBasket(product)}}
      >
        Add to Basket
      </button>

    </div>

    </div>
    </div>
  );
}