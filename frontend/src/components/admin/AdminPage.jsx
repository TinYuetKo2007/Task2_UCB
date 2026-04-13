import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import UsersTable from "./UsersTable";
import ProductsTable from "./ProductsTable";
import MessagesTable from "./MessagesTable";
import ApplicationsTable from "./ApplicationsTable";

import farm_food from "../../image/farm_food.jpg";
import default_image from "../../image/default_image.png";

export default function AdminPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [err, setErr] = useState(null);

  const checkAdmin = useCallback(async () => {
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

      if (data.role === "ADMIN") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    } catch (e) {
      setErr("Failed to load admin data");
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

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

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (err) {
    return <h1>{err}</h1>;
  }

  if (!authorized) {
    return <h1>Access denied (admin only)</h1>;
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
            <h2>Admin Dashboard</h2>
          </div>
        </div>
      </div>

      <div className="admin-dashboard">
        <div className="admin-layout">

          <div className="admin-section">
            <div className="admin-header">
              <h3>Users</h3>
              <button onClick={() => navigate("/admin/edit/users")}>Edit</button>
            </div>
            <UsersTable />
          </div>

          <div className="admin-section">
            <div className="admin-header">
              <h3>Products</h3>
              <button onClick={() => navigate("/admin/edit/products")}>Edit</button>
            </div>
            <ProductsTable />
          </div>

          <div className="admin-section">
            <div className="admin-header">
              <h3>Messages</h3>
              <button onClick={() => navigate("/admin/edit/contact-messages")}>Edit</button>
            </div>
            <MessagesTable />
          </div>

          <div className="admin-section">
            <div className="admin-header">
              <h3>Producer Applications</h3>
              <button onClick={() => navigate("/admin/edit/producerApplications")}>Edit</button>
            </div>
            <ApplicationsTable />
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