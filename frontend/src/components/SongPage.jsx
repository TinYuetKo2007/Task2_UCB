import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
export default function SongPage() {
    const params = useParams()
    const songId = params.songId
    const [song, setSong] = useState()
    const [loading, setLoading] = useState(false);
     const fetchSong = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/songs/${songId}`, {
          method: "GET",
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        const data = await res.json();
        setSong(data);
        setLoading(false);
      }, [songId])
      
      useEffect(() => {
        fetchSong();
      }, [fetchSong]);

    if (loading) {
        return (
          <>
            <h1>Songs are loading...</h1>
          </>
        );
      }
      if (song == null) {
        return (
          <>
            <h1>Error: unable to fetch songs</h1>
          </>
        );
      }
    return (
        <div>
            <h1>{ song.artist_name }</h1>
            <img src={song.cover_image}/>
            <h2>{ song.title }</h2>
        </div>
    )
}