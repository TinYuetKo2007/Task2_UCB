import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:4000/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful");

        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } else {
        setMessage(data.message || "Reset failed");
      }

    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="container">
      <div className="form-container">

        <h1>Reset Password</h1>

        <button onClick={() => navigate("/login")}>
          Go Back
        </button>

        <form className="form" onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        <p>{message}</p>

      </div>
    </div>
  );
}