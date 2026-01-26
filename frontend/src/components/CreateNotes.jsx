import axios from "axios";
import { useState } from "react"

export default function CreateNotes({onSuccess}) {
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [message, setMessage] = useState("");

 const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !text) {
            setMessage("Please enter title and content.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/notes", { title, text }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            });

            const data = res.data;

            if (data.success) {
                setMessage("Note created successfully.");
                onSuccess()
            } else {
                setMessage(data.message || "Submission failed.");
            }
        } catch (err) {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <>
        <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
            <h1>Add a Note</h1>

            <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea  
                placeholder="Text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Create Note</button>
        </form>
        </div>
        </>
    )
}