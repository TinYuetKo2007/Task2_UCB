import { useState, useEffect } from "react";
import axios from "axios";
const API = "http://localhost:4000";


function List () {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState("");
    async function fetchSongs() {
    try {
        const res = await axios.get(`${API}/songs`);
        setSongs(res.data.songs);
        setError("");
    } catch {
        setError("Error fetching songs");
    }
    }

    useEffect(() => {
    fetchSongs();
    }, []);

    return (
        <ul>
        {(songs || []).map((song) => (
            <li key={song.id}>
            {song.title} — {song.artist} ({song.genre}, {song.year})
            </li>
        ))}
        </ul>
    )
}
export default List;