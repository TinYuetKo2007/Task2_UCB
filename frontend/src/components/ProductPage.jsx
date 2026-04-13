import { useParams } from "react-router-dom";
import ProductDisplay from "./ProductDisplay";
import { useState, useEffect } from "react";
export default function ProductPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const product = products.find(
    (product) => product.id === Number(params.productId)
  );

  if (products.length === 0) return <h1>Loading...</h1>;

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  return (
    <div>
      <ProductDisplay product={product} />
    </div>
  );
}