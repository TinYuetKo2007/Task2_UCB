import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct({ onSuccess }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/me", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const userData = await res.json();
      console.log(userData.role);

      setUser(userData);
      setLoading(false);
    } catch {
      setErr("Error fetching user");
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (err) {
    return <h1>{err}</h1>;
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "PRODUCER")) {
    return <h1>Access denied.</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !title || !description || !price || !category || !stock) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/products",
        { image, title, description, price, category, stock },
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
        setPrice(0);
        setCategory("");

        onSuccess();
      } else {
        setMessage(data.message || "Submission failed.");
      }
    } catch {
      setMessage("Server error. Please try again later.");
    }
  };

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
          <option value="" disabled>Category</option>

          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Herbs">Herbs</option>
          <option value="Salads">Salads & Greens</option>

          <option value="Dairy">Dairy</option>
          <option value="Eggs">Eggs</option>
          <option value="Meat">Meat</option>

          <option value="Bakery">Bakery</option>
          <option value="Homemade">Homemade Goods</option>

          <option value="Honey">Honey</option>
          <option value="Preserves">Preserves</option>
          <option value="Condiments">Condiments & Oils</option>

          <option value="Drinks">Drinks</option>
        </select>
        <p style={{paddingBottom: "0px"}}>Price</p>
        <input
          type="number"
          step="0.01"
          placeholder="Price (In Pounds)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <p style={{paddingBottom: "0px"}}>Stock</p>
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
        {message && <p>{message}</p>}
        <button type="submit">Add New Product</button>

      </form>
    </div>
    </div>
  );
}