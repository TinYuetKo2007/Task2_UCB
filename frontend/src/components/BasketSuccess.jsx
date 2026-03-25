import { Link } from "react-router-dom";

export default function BasketSuccess() {
  return (
    <div>
      <h1>Product Added to Basket!</h1>

      <p>Your item has been successfully added to your basket.</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/basket">
          <button>Go to Basket</button>
        </Link>

        <Link to="/products">
          <button>Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}