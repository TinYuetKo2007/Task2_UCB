import { useState } from "react";
import bakery from "../image/bread_bakery.jpg"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
     if (data.success) {
      setMessage("Login successful!");

      localStorage.setItem('email', email);
      localStorage.setItem('token', data.token);
      setTimeout(() => navigate("/profile"), 1000);
    } else {
      setMessage(data.message);
    }
  };

    return (
        <div className="auth-container">
            <div className="form-container">
              <button onClick= {() => navigate("/")}>Go Back</button>
                    <form className="form" onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <input 
                        required
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                        required
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                        <Link to="/forgot-password">
                          Forgot Password?
                        </Link>
                        <button type="submit">Log In</button>
                        <p>Not a member? <Link to="/signup">Sign Up</Link></p>
                        {message && <p className="login-message">{message}</p>}
                    </form>
                 </div>
            <img src={bakery} />
        </div>
    )
}