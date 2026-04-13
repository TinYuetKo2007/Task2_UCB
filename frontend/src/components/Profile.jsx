import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import farm_food from "../image/farm_food.jpg";
import default_image from "../image/default_image.png";

export default function Profile () {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("");
    const [role, setRole] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const fetchUser = useCallback(async () => {
        if (!localStorage.getItem("token")) {
            return navigate("/login");
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:4000/me/profile", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            const data = await res.json();

            setEmail(data.email);
            setForename(data.forename);
            setSurname(data.surname);
            setRole(data.role);

            setLoading(false);
        } catch {
            setErr("Error fetching email");
            setLoading(false);
        }

    }, [navigate]);

const fetchOrders = async () => {
    try {

        const res = await fetch("http://localhost:4000/me/orders", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();


        const groupedOrders = [];

        data.forEach(item => {

            let existingOrder = groupedOrders.find(
                o => o.orderId === item.orderId
            );

            if (!existingOrder) {
                existingOrder = {
                    orderId: item.orderId,
                    createdAt: item.createdAt,
                    total: item.total,
                    status: item.status,
                    products: []
                };

                groupedOrders.push(existingOrder);
            }

            existingOrder.products.push({
                productId: item.productId,
                title: item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            });

        });

        setOrders(groupedOrders);

    } catch (err) {
        console.log("Error fetching orders", err);
    }
};

    useEffect(() => {
        fetchUser();
        fetchOrders();
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

    return (
        <div>
            <div className='parent-container'>
                <img
                    src={farm_food}
                    style={{
                        width: "100vw",
                        height: "170px",
                        objectFit: "cover",
                        filter: "brightness(50%)"
                    }}
                />
                <div className='bottom-left'>
                    <div className='main-title'>
                        <b><h2>Profile</h2></b>
                    </div>
                </div>
            </div>

            <div style={{ padding: "40px" }}>
                <h1>Welcome, {forename}!</h1>
                <h2>Full Name: {forename} {surname}</h2>
                <h2>Email: {email}</h2>
                
                <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                <button onClick={() => navigate("/settings")}>
                    Settings
                </button>
                <button 
                        onClick={() => navigate("/apply-for-producer")}>
                        Producer Application
                    </button>
                
                {/* ADMIN BUTTON */}
                {role === "ADMIN" && (
                    <button 
                        onClick={() => navigate("/admin")}
                    >
                        Admin Dashboard
                    </button>
                )}
                {role === "PRODUCER" && (
                    <button 
                        onClick={() => navigate("/producer")}
                    >
                        Producer Dashboard
                    </button>
                )}
                </div>
                <h2>Recent purchases</h2>
                <div className="orders-container">
                    {orders.length === 0 ? (
                        <p>No orders yet</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.orderId} className="order-card">
                                <h3>Order #{order.orderId}</h3>
                                <p>Date: {order.createdAt}</p>
                                <p>Total: £{order.total}</p>
                                <p>Status: {order.status}</p>

                                <h4>Products</h4>

                                {order.products.map(product => (
                                    <div
                                        key={product.productId}
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        <img
                                            src={product.image || default_image}
                                            alt={product.title}
                                            width="60"
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents infinite loop
                                                e.target.src = default_image;
                                            }}
                                        />

                                        <div>
                                            <p>{product.title}</p>
                                            <p>Quantity: {product.quantity}</p>
                                            <p>Price: £{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}</div>
            </div>
        </div>
    );
}