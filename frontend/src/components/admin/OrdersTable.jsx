import { useState, useEffect } from "react";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [role, setRole] = useState(null);

  const fetchRole = async () => {
    try {
      const res = await fetch("http://localhost:4000/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async (userRole) => {
    try {
      setLoading(true);
  
      const endpoint =
        userRole === "ADMIN"
          ? "http://localhost:4000/orders"
          : "http://localhost:4000/producer/orders";
  
      const res = await fetch(endpoint, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      const data = await res.json();
  
      console.log("API response:", data);
  
      setOrders(Array.isArray(data) ? data : []);
  
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErr("Failed to fetch orders");
      setLoading(false);
    }
  };

    useEffect(() => {
    const init = async () => {
        const res = await fetch("http://localhost:4000/me", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        });

        const user = await res.json();
        setRole(user.role);

        await fetchOrders(user.role);
    };

    init();
    }, []);

  if (loading) return <h1>Loading...</h1>;
  if (err) return <h1>{err}</h1>;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "1400px",
          minWidth: "1200px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Delivery</th>
            <th>Address</th>
            <th>Product</th>
            <th>Image</th>
            <th>Quantity</th>
            <th>Price (£)</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.orderId}</td>
              <td>
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td>{order.status}</td>
              <td>{order.deliveryMethod}</td>
              <td>{order.address}</td>

              <td>{order.title}</td>

              <td>
                {order.image ? (
                  <img
                    src={order.image}
                    alt="product"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/default_image.png";
                    }}
                  />
                ) : (
                  "No image"
                )}
              </td>

              <td>{order.quantity}</td>
              <td>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}