import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function Repertoire() {
  const [songs, setSongs] = useState([]);


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


  return (
    <Container className="pt-4">
      <h3>Repertorio de Canciones</h3>
      <hr />
      {songs.length > 0 ? (
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <Card>
                <Card.Body>
                  <p>{song.name}</p>
                  <p>URL: {song.url}</p>
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p>No hay canciones en el repertorio.</p>
          <Alert variant="danger">Aún no se desarrollado esta función.</Alert>
        </>
      )}
    </Container>
  );
}
