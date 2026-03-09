import { useEffect, useState } from "react";
import CreateNotes from "./CreateNotes";
export default function Notes() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(null);

  // fetch data from server backend
  const fetchNotes = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/notes", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const data = await res.json();
    setNotes(data.notes);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Check if notes are loaded in
  if (loading) {
    return (
      <>
        <h1>Notes are loading...</h1>
      </>
    );
  }
  if (notes == null) {
    return (
      <>
        <h1>Error: unable to fetch notes</h1>
      </>
    );
  }
  return (
    <div style={{display: "flex", 
    flexDirection: "column", 
    maxWidth: "100%",
    alignItems: "start"}}>
    <h1>Notes</h1>
    <div className="container">

      <div>
        <CreateNotes onSuccess={fetchNotes}/>
      </div>
      
      <div className="notes-display">
      {notes.map((note) => (
        <div key={note.id}>
          <h2>{note.title}</h2> <h3>{note.text}</h3>
        </div>
      ))}
      </div>
    </div>
    </div>
  );
}
