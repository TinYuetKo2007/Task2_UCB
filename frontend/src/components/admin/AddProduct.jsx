import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct({ onSuccess }) {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !image || !description || !category) {
      setMessage("Please fill in all required fields.");
      return;
    }
  
    if (price === "" || stock === "") {
      setMessage("Price and stock are required.");
      return;
    }
  
    if (Number(price) < 0 || Number(stock) < 0) {
      setMessage("Price and stock cannot be negative.");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:4000/products",
        {
          image,
          title,
          description,
          price: Number(price),
          category,
          stock: Number(stock),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
  
      const data = res.data;
  
      if (data.success || res.status === 200) {
        setMessage("Product added successfully.");
  
        setTitle("");
        setImage("");
        setDescription("");
        setPrice("");
        setCategory("");
        setStock("");
  
        typeof onSuccess === "function" && onSuccess();
      } else {
        setMessage(data.message || "Submission failed.");
      }
    } catch {
      setMessage("Server error. Please try again later.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container">
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Add a Product</h1>

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruit">Fruit</option>
          <option value="Herbs">Herbs</option>
          <option value="Salads">Salads & Greens</option>
          <option value="Dairy">Dairy</option>
          <option value="Eggs">Eggs</option>
          <option value="Meat">Meat</option>
          <option value="Bakery">Bakery</option>
          <option value="Prepared Artisan Foods">Prepared / Artisan Foods</option>
          <option value="Honey">Honey</option>
          <option value="Preserves">Preserves</option>
          <option value="Condiments">Condiments & Oils</option>
          <option value="Drinks">Drinks</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Price (£)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        {message && <p>{message}</p>}
        <button type="submit">Add New Product</button>

      </form>
    </div>
    </div>
  );
}