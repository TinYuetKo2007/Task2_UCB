import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import UsersTable from "./UsersTable";
import ProductsTable from "./ProductsTable";
import MessagesTable from "./MessagesTable";
import farm_food from "../../image/farm_food.jpg"
import default_image from "../../image/default_image.png"

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
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
  if (user.role !== "ADMIN") {
    return <h1>Not an admin: Access denied.</h1>;
  }

  const syncStripeProducts = async () => {
    await fetch("http://localhost:4000/sync-stripe-products", {
      method: "POST"
    });
  
    alert("Stripe products synced");
  };

  return (
    <>
    <div className='parent-container'>
      <img src={farm_food}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = default_image;
      }} 
      style={{
      width: "100vw",
    height: "170px",
    objectFit: "cover",
    filter: "brightness(50%)"
      }}/>
        <div className='bottom-left'>
      <div className='main-title'>
      <b><h2>Admin Dashboard</h2></b>
      </div>
    </div>
  </div>

  <div className="admin-dashboard">
    <div className="admin-layout">
      
      <div className="admin-section">
        <div className="admin-header">
          <h3>List of Users</h3>
          <button className="edit-btn" onClick={() => navigate("/admin/edit/users")}>Edit</button>
        </div>
        <UsersTable />
      </div>

      <div className="admin-section">
        <div className="admin-header">
          <h3>List of Products</h3>
          <button className="edit-btn" onClick={() => navigate("/admin/edit/products")}>Edit</button>
        </div>
        <ProductsTable />
      </div>
      <div className="admin-section">
        <div className="admin-header">
          <h3>List of Messages</h3>
          <button className="edit-btn" onClick={() => navigate("/admin/edit/contactMessages")}>Edit</button>
        </div>
        <MessagesTable />
      </div>

    </div>
    <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
      <button className="report-btn"
        onClick={() => navigate("add-product")}>
        Add Product
      </button>
      <button className="report-btn" onClick={() => navigate("reports")}>
        Create report
      </button>
      <button className="report-btn" onClick={syncStripeProducts}>
    Sync Stripe Catalog
    </button>
  </div>
  </div></>
);
}
