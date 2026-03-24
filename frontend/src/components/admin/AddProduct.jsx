import axios from "axios";
import { useState } from "react"

export default function AddProduct({onSuccess}) {
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0.0)
    const [category, setCategory] = useState("")
    const [_, setMessage] = useState("");

    const fetchUser = useCallback(async () => {
        if (!localStorage.getItem("token")) {
          return navigate("/login");
        }
        // Allows server to identify user
        try {
          setLoading(true);
          const res = await fetch("http://localhost:4000/me", {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          const user = await res.json();
          console.log(user.role);
          setUser(user);
          setLoading(false);
        } catch {
          setErr("Error fetching username");
          setLoading(false);
        }
      }, [navigate]);
    
      useEffect(() => {
        fetchUser();
      }, [fetchUser]);
      if (loading) {
        return (
          <div>
            <h1>Loading...</h1>
          </div>
        );
      }
      if (err) {
        return <h1>{err}</h1>;
      }
      if (user.role !== "ADMIN" && user.role !== "PRODUCER") {
        return <h1>Not an admin or producer: Access denied.</h1>;
      }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image || !title || !description || !price || !category) {
            setMessage("Please enter title and content.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/products", { image, title, description, price, category }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            });

            const data = res.data;

            if (data.success) {
                setMessage("Product added successfully.");
                onSuccess()
            } else {
                setMessage(data.message || "Submission failed.");
            }
        } catch {
            setMessage("Server error. Please try again later.");
        }
    };

    return (

        <div className="alt-form-container">
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
            <input 
                type="text" 
                placeholder="Category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <input
            type="number"
                step="0.01"
                placeholder="Price (In Pounds)"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <button type="submit">Add New Product</button>
        </form>
        </div>
    )
};

