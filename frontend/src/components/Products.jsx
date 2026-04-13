import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import farm_food from "../image/farm_food.jpg";
import default_image from "../image/default_image.png";
import { useBasket } from "../BasketContext";

const Message = ({ message }) => (
  <section className="message">
    <p>{message}</p>
  </section>
);

export default function Products() {
  const { basket } = useBasket();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    async function loadProducts() {
      try {

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/products", {
          headers: token && token !== "null"
            ? { Authorization: `Bearer ${token}` }
            : {}
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          setProducts([]);
          return;
        }

        if (Array.isArray(data)) {
          setProducts(data);
        }

      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage(
        "Product bought successfully! You will receive an email confirmation."
      );
    }
    if (query.get("canceled")) {
      setMessage("Order cancelled — continue shopping.");
    }
  }, []);

  if (message)
    return (
      <>
        <Message message={message} />
        <button onClick={() => navigate("/products")}>Back</button>
      </>
    );

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category))
  ];

  const filteredProducts = products.filter((product) => {
    if (product.title === "Delivery Fee") return false;
  
    if (selectedCategory !== "All") {
      return product.category === selectedCategory;
    }
  
    return true;
  });
  
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="products-page">

      <div className="header-container">
        <img src={farm_food} alt="Farm Food" className="header-image" />
        <div className="header-overlay">
          <h2>Products</h2>
        </div>
      </div>

      <div className="container">
        <div className="products-content">

          <div className="product-searcher">

            <SearchBar
              data={products.map(p => ({
                ...p,
                path: `/products/${p.id}`
              }))}
              searchKey="title"
              placeholder="Search products..."
            />

            <h3>Categories</h3>

            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={
                      selectedCategory === cat ? "active-category" : ""
                    }
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

          </div>

          <div className="product-list">
            <ul className="products-grid">
            {currentProducts.map((product) => (
              <li
                key={product.id}
                className={`product-item ${product.stock === 0 ? "out-of-stock" : ""}`}
              >
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image || default_image}
                    alt={product.title}
                    onError={(e) => {
                      if (e.target.src !== default_image)
                        e.target.src = default_image;
                    }}
                  />

                  <p>{product.title}</p>

                  {product.stock === 0 && (
                    <span className="stock-label">Out of stock</span>
                  )}
                </Link>
              </li>
            ))}
            </ul>
          </div>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>

      <div className="basket-container">
        <button
          className="basket-button"
          onClick={() => navigate("/basket")}
        >
          View Basket ({basket.length})
        </button>
      </div>

    </div>
  );
}