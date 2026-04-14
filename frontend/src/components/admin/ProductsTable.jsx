import { useState, useEffect } from "react";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
  
        // Sync Stripe products first
        await fetch("http://localhost:4000/sync-stripe-products", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
  
        // Then fetch products from DB
        const res = await fetch("http://localhost:4000/products", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        const data = await res.json();
  
        console.log("Products:", data);
  
        if (Array.isArray(data)) {
          setProducts(data);
        }
  
      } catch (err) {
        console.error(err);
      }
    }
  
    fetchProducts();
  }, []);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price (£)</th>
          <th>Product Description</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.title}</td>
            <td>{product.price}</td>
            <td>{product.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}