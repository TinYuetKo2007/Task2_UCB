import bakery from "../image/bread_bakery.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("")
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

 const handleRegister = async (e) => {
        e.preventDefault();

        if (!forename || !surname || !email || !password) {
            setMessage("Please enter all details.");
            return;
        }
        if (password.length < 8) {
            setMessage("Password must be at least 8 characters.");
            return;
        }
         
        try {
            const res = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ forename, surname, email, password }),
            });

            const data = await res.json();

            if (data.success && data.token) {
                localStorage.setItem("email", email);
                localStorage.setItem("token", data.token);
            
                setMessage("Registration successful! Redirecting...");
                navigate("/profile", { replace: true });
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="auth-container">
            <div className="form-container">
                <button onClick={() => navigate("/")}>Go Back</button>
                    <form className="form" onSubmit={handleRegister}>
                    <h1>Sign Up</h1>
                    <div style={{display:"flex", flexDirection: "row"}}>
                        <input 
                        type="text" 
                        placeholder="First Name" 
                        value={forename}
                        onChange={(e) => setForename(e.target.value)}
                        className="name-input"/>

                        <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="name-input"/>
                    </div>
                    <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
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
            <img src={bakery} />
        </div>
    )
}