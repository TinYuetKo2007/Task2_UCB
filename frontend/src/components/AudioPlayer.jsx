import React, { useRef, useEffect, useState } from "react";

const AudioPlayer = ({ audioSrc, imageSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  const formatDuration = (durationSeconds) => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <div className="player-card">
      <img src={imageSrc} alt="Cover"/>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />

      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="track-duration">
        <p>{formatDuration(currentTime)}</p>
        <p>{formatDuration(duration)}</p>
      </div>

      <button onClick={handlePlayPause}>
        <span className="material-symbols-rounded">
          {isPlaying ? "⏸︎" : "▶"}
        </span>
      </button>
    </div>
  );
};

export default AudioPlayer;