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
    <>
      <div style={{ backgroundColor: "#FFE2B6" }}>
        <h1>Notes</h1>
      </div>
      <CreateNotes onSuccess={fetchNotes}/>
      {notes.map((note, index) => (
        <div key={note.id}>
          <h2>{note.title}</h2> <h3>{note.text}</h3>
        </div>
      ))}
    </>
  );
}
