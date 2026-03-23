import { useState, useEffect } from "react";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
  
        // Sync Stripe products first
        await fetch("http://localhost:4000/sync-stripe-products", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
  
        // Then fetch products from DB
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();
  
        console.log("Products:", data);
  
        if (Array.isArray(data)) {
          setProducts(data);
        }
  
      } catch (err) {
        console.error(err);
      }
    }
  
    loadProducts();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product Description</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.title}</td>
            <td>{product.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}