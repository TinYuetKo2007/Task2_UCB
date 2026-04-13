import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Reset link sent to your email");
      } else {
        setMessage(data.message || "Something went wrong");
      }

    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="container">
    <div className="form-container">
      <h1>Forgot Password</h1>
       <button onClick= {() => navigate("/login")}>Go Back</button>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          Send Reset Link
        </button>
      </form>

      <p>{message}</p>
    </div>
    </div>
  );
}