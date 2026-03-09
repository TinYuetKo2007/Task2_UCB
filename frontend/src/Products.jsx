import { useState, useEffect } from "react";
import Header from "./components/Header.jsx"
import ProductDisplay from "./components/ProductDisplay.jsx";
import { Link } from "react-router-dom"
import { products } from "./products.js";
const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Products() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Ticket bought successfully! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order cancelled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <>
    <Message message={message} />
    <Link onClick={() => window.location.href="/products"}>s</Link>
    </>
    
  ) : (
    <div className="product-list"><h1>Products</h1>
        <ul>{products.map((product) => (
                // <ProductDisplay key={product.name} product={product}/>
                <li>
                  <Link to={`/products/${product.productId}`}>{product.name}</Link>
                </li>
        ))}</ul>
    </div>
  );
}