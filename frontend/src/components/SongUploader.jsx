import { useState, useEffect } from "react";
import Header from "./Header";

const API = "http://localhost:4000";

function SongUploader({ addSong }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  const [songs, setSongs] = useState([]);
  
  const isLoggedIn = !!localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setError("You must be logged in to upload a song.");
      return;
    }

    if (!file || !title || !artist || !year) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    const newSong = {
      year,
      title,
      artist,
      genre,
      fileURL: URL.createObjectURL(file),
    };

    addSong(newSong);
    setTitle("");
    setArtist("");
    setGenre("");
    setFile(null);
    setYear("");
  };

  useEffect(() => {
    fetch(`${API}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data.songs))
      .catch(() => setError("Failed to fetch songs."));
  }, []);

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Upload Song</h1>

        <form onSubmit={handleSubmit} className="form">
          <h3>Audio</h3>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className={`py-2 rounded text-white ${
              isLoggedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isLoggedIn}
          >
            Upload Song
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SongUploader;