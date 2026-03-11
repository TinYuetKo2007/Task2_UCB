import { useState, useEffect } from "react";
import { Link } from "react-router-dom"

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Products() {
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

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