import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import farm_food from "../image/farm_food.jpg"

export default function Profile () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("");

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null)
    const fetchUser = useCallback(async () => {
        if (!localStorage.getItem("token")) {
        return (navigate("/login"))
    }
        // Allows server to identify user
        try {
            setLoading(true)
        const res = await fetch("http://localhost:4000/me/profile", {method: "GET", headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }});
        const data = await res.json()
        setEmail(data.email)
        setForename(data.forename)
        setSurname(data.surname)
        setLoading(false)
        } catch {
            setErr("Error fetching username")
            setLoading(false)}
        
    }, [navigate]);

    useEffect(() => {fetchUser()}, [fetchUser]);
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
            <div className='parent-container'>
                <img src={farm_food} style={{
                width: "100vw",
                height: "170px",
                objectFit: "cover",
                filter: "brightness(50%)"
                }}/>
                    <div className='bottom-left'>
                <div className='main-title'>
                <b><h2>Profile</h2></b>
                </div>
                </div>
            </div>
        <div style={{padding: "40px"}}>
            <h1>Welcome, {forename}!</h1>
            <h2>Full Name: {forename} {surname}</h2>
            <h2>Email: {email}</h2>
            <button onClick={() => navigate("/settings")}>Settings</button>
            <h2>Recent purchases:</h2>
        </div>
        </div>
    )
}