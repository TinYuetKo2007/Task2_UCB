import { useState } from "react";
import axios from "axios";

function Contact() {
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:4000/contact-messages",
                { email, text }
            );

            if (res.data.success) {
                setStatus("Message sent successfully!");
                setText("");
                setEmail("");
            }
        } catch {
            setStatus("Failed to send message.");
        }
    };

    return (
        <div className="container">
            <div className="alt-form-container" style={{ alignItems: "center" }}>
                <form className="form" onSubmit={handleSubmit}>
                    <h2>Greenfield Local Hub</h2>
                    <h3>Drop us a message!</h3>

                    {status && <p style={{ color: "white" }}>{status}</p>}

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <textarea
                        rows="4"
                        placeholder="Your Message"
                        value={text}
                        required
                        onChange={(e) => setText(e.target.value)}
                    />

                    <br />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Contact;