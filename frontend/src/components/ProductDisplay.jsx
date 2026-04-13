import { useBasket } from "../BasketContext";
import { useNavigate } from "react-router-dom";
import default_image from "../image/default_image.png";
import axios from "axios";

export default function ProductDisplay({ product }) {
  const { addToBasket } = useBasket();
  const navigate = useNavigate();

    const handleBuyNow = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const singleBasket = [
          {
            id: product.id,
            productId: product.productId,
            title: product.title,
            price: product.price,
            image: product.image || default_image,
            quantity: 1
          }
        ];

        const res = await axios.post(
          "http://localhost:4000/create-checkout-session",
          {
            basket: singleBasket,
            address: "collection",
            deliveryMethod: "collection"
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        window.location.href = res.data.url;

      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

  const handleAddToBasket = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    addToBasket(product);
    navigate("/basket-success");
  };

  return (
    <div className="container">
      <div className="form-container">
        <img
          src={product.image || default_image}
          alt={product.title}
          onError={(e) => { e.target.src = default_image; }}
        />
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h2>£{product.price}</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleBuyNow}>Buy Now</button>
          <button type="button" onClick={handleAddToBasket}>Add to Basket</button>
        </div>
      </div>
    </div>
  );
}