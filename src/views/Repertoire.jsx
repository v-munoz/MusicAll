import React, { useState, useEffect } from "react";
import { Button, Card } from 'react-bootstrap';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function Repertoire() {
  const [songs, setSongs] = useState([]);
  const [audio] = useState(new Audio());
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const db = getFirestore();
        const songsCollection = collection(db, 'songs');
        const querySnapshot = await getDocs(songsCollection);
        const songData = querySnapshot.docs.map(doc => doc.data());
        setSongs(songData);
      } catch (error) {
        console.error("Error al obtener las canciones:", error);
      }
    };

    fetchSongs();
  }, []);

  const handlePlay = (url) => {
    if (url === currentSong) {
      audio.play();
    } else {
      audio.src = url;
      audio.play();
      setCurrentSong(url);
    }
  };

  const handlePause = () => {
    audio.pause();
  };

  const handleStop = () => {
    audio.pause();
    audio.currentTime = 0;
    setCurrentSong(null);
  };

  return (
    <div>
      <h3>Repertorio de Canciones</h3>
      {songs.length > 0 ? (
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <Card>
                <Card.Body>
                  <p>{song.name}</p>
                  <p>URL: {song.url}</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => handlePlay(song.url)}>Play</Button>
                    <Button onClick={() => handlePause()} style={{ backgroundColor: 'yellow', color: 'black' }}>Pause</Button>
                    <Button onClick={() => handleStop()} style={{ backgroundColor: 'red' }}>Stop</Button>
                  </div>
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay canciones en el repertorio.</p>
      )}
    </div>
  );
}
