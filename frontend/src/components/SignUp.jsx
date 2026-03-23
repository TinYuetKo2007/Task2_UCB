import giraffe from "../image/giraffe.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("")
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

 const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !forename || !surname || !password) {
            setMessage("Please enter username and password.");
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("username", username);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                setMessage("Registration successful! Redirecting...");
                setTimeout(() => navigate("/profile"), 1000);
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="container" style={{ height: "100vh"}}>
            <div className="form-container">
                    <form className="form" onSubmit={handleRegister}>
                    <button onClick={() => navigate("/")}>Go Back</button>
                    <h1>Sign Up</h1>
                    <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}/>

                    <input 
                    type="text" 
                    placeholder="First Name" 
                    value={forename}
                    onChange={(e) => setForename(e.target.value)}/>

                    <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}/>

                    <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Sign Up</button>
                    <p>Not a member? <Link to="/login">Log In</Link></p>
                </form>
                    <p>{message}</p>
            </div>
            <img src={giraffe} />
        </div>
    )
}