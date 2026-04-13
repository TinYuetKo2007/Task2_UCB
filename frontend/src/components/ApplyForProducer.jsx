import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplyForProducer() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [producerName, setProducerName] = useState("")
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

        const fetchUser = useCallback(async () => {
            if (!localStorage.getItem("token")) {
                return navigate("/login");
            }
    
            try {
                setLoading(true);
    
                const res = await fetch("http://localhost:4000/me/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
    
                const data = await res.json();
    
                setEmail(data.email);
    
                setLoading(false);
            } catch {
                setErr("Error fetching email");
                setLoading(false);
            }
    
        }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("email", email);
            formData.append("producerName", producerName);
            formData.append("address", address);
            formData.append("description", description);
            formData.append("fsa_rating", document.getElementById("fsa-rating").value);

            const file = document.getElementById("hygiene-cert").files[0];
            if (file) {
                formData.append("hygiene_cert", file);
            }

            const res = await axios.post(
                "http://localhost:4000/producer-application",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setStatus("Application submitted successfully!");
                setProducerName("");
                setAddress("");
                setDescription("");
            }

        } catch (err) {
            console.log(err);
            setStatus("Failed to submit application.");
        }
    };

        useEffect(() => {
            fetchUser();
        }, [fetchUser]);
    
        if (loading) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        }
    
        if (err) {
            return <h1>{err}</h1>;
        }
   return (
    <div className="producer-page">
        <div className="container">
            <div className="form-container" style={{ alignItems: "center" }}>
                <form className="form" onSubmit={handleSubmit}>
                    <h2>Greenfield Local Hub</h2>
                    <h3>Producer Application Form</h3>

                    <fieldset>
                    <input
                        type="text"
                        placeholder="Producer Name"
                        value={producerName}
                        required
                        onChange={(e) => setProducerName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    </fieldset>

                    <textarea
                        rows="4"
                        placeholder="Tell us about your business."
                        value={description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    />
                      <fieldset>
                        <legend>Safety & Compliance</legend>
                        <label htmlFor="fsa-rating">Current Food Hygiene Rating (0-5):</label>
                        <input type="number" id="fsa-rating" name="fsa_rating" min="0" max="5"/>
                        
                        <label htmlFor="hygiene-cert">Upload Food Hygiene Certificate (PDF/JPG):</label>
                        <input type="file" id="hygiene-cert" name="hygiene_cert"/>
                    </fieldset>
                    <br />
                    <button type="submit">Submit</button>
                    {status && <p style={{ color: "white" }}>{status}</p>}
                </form>
            </div>
        </div>
    </div>
   ) 
}