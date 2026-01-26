import Header from "./Header";
import { useEffect, useState } from "react";
import List from "../List.jsx"
import { Navigate, useNavigate } from "react-router-dom";
export default function Profile () {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null)
    const fetchUser = async () => {
        if (!localStorage.getItem("token")) {
        return (navigate("/login"))
    }
        // Allows server to identify user
        try {
            setLoading(true)
        const res = await fetch("http://localhost:4000/me", {method: "GET", headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }});
        const data = await res.json()
        setUsername(data.username)
        setLoading(false)
        } catch(err) {
            setErr("Error fetching username")
            setLoading(false)}
        
    };
    
    useEffect(() => {fetchUser()}, []);
    if (loading) {
        return (<div>
            <h1>Loading...</h1>
            </div>)
    }
    if (err) {
        return (<h1>{err}</h1>)
    }

    return (
        <div>
            <Header/>
            <h1>Welcome, {username}!</h1>
            <List/>
        </div>
    )
}