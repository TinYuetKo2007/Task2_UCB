import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import ProductsTable from "../admin/ProductsTable";
import MessagesTable from "../admin/MessagesTable";

import farm_food from "../../image/farm_food.jpg";
import default_image from "../../image/default_image.png";

export default function ProducerPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const checkUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setRole(data.role);

      setLoading(false);
    } catch (e) {
      setErr("Error fetching user");
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const syncStripeProducts = async () => {
    try {
      await fetch("http://localhost:4000/sync-stripe-products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Stripe products synced");
    } catch (err) {
      alert("Sync failed");
    }
  };

  if (loading) return <h1>Loading...</h1>;
  if (err) return <h1>{err}</h1>;

  if (role !== "ADMIN" && role !== "PRODUCER") {
    return <h1>Access denied</h1>;
  }

  return (
    <>
      <div className="parent-container">
        <img
          src={farm_food}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = default_image;
          }}
          style={{
            width: "100vw",
            height: "170px",
            objectFit: "cover",
            filter: "brightness(50%)"
          }}
        />

        <div className="bottom-left">
          <div className="main-title">
            <h2>Producer Dashboard</h2>
          </div>
        </div>
      </div>

      <div className="admin-dashboard">
        <div className="admin-layout">

          <div className="admin-section">
            <div className="admin-header">
              <h3>My Products</h3>
              <button onClick={() => navigate("/producer/edit/products")}>
                Edit
              </button>
            </div>

            <ProductsTable type="producer" />
          </div>

          <div className="admin-section">
            <div className="admin-header">
              <h3>Customer Messages</h3>
              <button onClick={() => navigate("/producer/edit/contact-messages")}>
                Edit
              </button>
            </div>

            <MessagesTable type="producer" />
          </div>

        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => navigate("add-product")}>
            Add Product
          </button>

          <button onClick={() => navigate("reports")}>
            Create report
          </button>

          <button onClick={syncStripeProducts}>
            Sync Stripe Catalog
          </button>
        </div>
      </div>
    </>
  );
}