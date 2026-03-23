import { useState } from "react";
import giraffe from "../image/giraffe.jpg"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
     if (data.success) {
      setMessage("Login successful!");
      // ✅ redirect to dashboard after 1 second
      localStorage.setItem('username', username);
      localStorage.setItem('token', data.token);
      setTimeout(() => navigate("/profile"), 1000);
    } else {
      setMessage(data.message);
    }
  };

    return (
        <div className="container" style={{ height: "100vh"}}>
            <div className="form-container">
                    <form className="form" onSubmit={handleLogin}>
                        <button onClick= {() => navigate("/")}>Go Back</button>
                        <h1>Login</h1>
                        <input 
                        required
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                        required
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                        <a href="#">Forgot Password?</a>
                        <button type="submit">Log In</button>
                        <p>Not a member? <Link to="/signup">Sign Up</Link></p>
                        {message && <p className="login-message">{message}</p>}
                    </form>
                 </div>
            <img src={giraffe} />
        </div>
    )
}