import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBasket } from "../BasketContext";
import farm_food from "../image/farm_food.jpg";

export default function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearBasket } = useBasket();

  const [status, setStatus] = useState("loading");
  const hasStored = useRef(false);

  const rawSessionId = searchParams.get("session_id");

  const sessionId =
    rawSessionId && rawSessionId.startsWith("cs_")
      ? rawSessionId
      : null;

  useEffect(() => {
    if (!sessionId || hasStored.current) return;

    hasStored.current = true;

    const storeOrder = async () => {
      const alreadyStored = localStorage.getItem("order_" + sessionId);

      if (alreadyStored) {
        clearBasket();
        setStatus("success");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        await axios.post(
          "http://localhost:4000/orders/store",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem("order_" + sessionId, "true");

        clearBasket();
        setStatus("success");

      } catch (err) {
        console.log("ORDER STORE ERROR:", err);
        setStatus("error");
      }
    };

    storeOrder();

  }, [sessionId, clearBasket, navigate]);

  return (
    <div>
      <div className="parent-container">
        <img
          src={farm_food}
          alt="farm food"
          style={{
            width: "100vw",
            height: "170px",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}
        />

        <div className="bottom-left">
          <div className="main-title">
            <h2>Payment Status</h2>
          </div>
        </div>
      </div>

      <div className="basket-container">
        {status === "loading" && <h2>Processing your order...</h2>}

        {status === "success" && (
          <>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => navigate("/products")}>
                Continue Shopping
              </button>

              <button onClick={() => navigate("/profile")}>
                View Orders
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Something went wrong.</h2>
            <button onClick={() => navigate("/products")}>
              Back to Products
            </button>
          </>
        )}
      </div>
    </div>
  );
}