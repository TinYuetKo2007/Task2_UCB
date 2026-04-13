import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import ProductsTable from "../admin/ProductsTable";
import MessagesTable from "../admin/MessagesTable";
import farm_food from "../../image/farm_food.jpg";
import default_image from "../../image/default_image.png";

export default function ProducerPage() {
  const navigate = useNavigate();
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

      const user = await res.json();
      setUser(user);
      setLoading(false);

    } catch {
      setErr("Error fetching user");
      setLoading(false);
    }
  }, [navigate]);

    const syncStripeProducts = async () => {
    await fetch("http://localhost:4000/sync-stripe-products", {
      method: "POST",
      headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
    });
  
    alert("Stripe products synced");
  };


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (err) {
    return <h1>{err}</h1>;
  }

  if (user.role !== "PRODUCER") {
    return <h1>Not a producer: Access denied.</h1>;
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
            <b><h2>Producer Dashboard</h2></b>
          </div>
        </div>
      </div>

      <div className="admin-dashboard">
        <div className="admin-layout">

          <div className="admin-section">
            <div className="admin-header">
              <h3>My Products</h3>
              <button
                className="edit-btn"
                onClick={() => navigate("/producer/edit/products")}
              >
                Edit
              </button>
            </div>

            <ProductsTable type="producer" />
          </div>

          <div className="admin-section">
            <div className="admin-header">
              <h3>Customer Messages</h3>
              <button
                className="edit-btn"
                onClick={() => navigate("/producer/edit/contact-messages")}
              >
                Edit
              </button>
            </div>

            <MessagesTable type="producer" />
          </div>

        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "20px"}}>
          
          <button
            className="report-btn"
            onClick={() => navigate("add-product")}
          >
            Add Product
          </button>

          <button
            className="report-btn"
            onClick={() => navigate("reports")}
          >
            Create report
          </button>

          <button className="report-btn" onClick={syncStripeProducts}>
          Sync Stripe Catalog
          </button>

        </div>
      </div>
    </>
  );
}