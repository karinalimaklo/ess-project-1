import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../MusicDetails.css';

export default function MusicDetailsPage() {
  const { id } = useParams(); 
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMusicDetails() {
      // Reseta o estado a cada nova busca (se o ID mudar)
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:4000/musics/${id}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erro ao buscar detalhes da música.');
        }

        const data = await res.json();
        setMusic(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchMusicDetails();
    }
  }, [id]);

  if (loading) return <div className="loading-message">Carregando...</div>;
  if (error) return <div className="error-message">Erro: {error}</div>;
  if (!music) return <div className="not-found-message">Música não encontrada.</div>;

  // detalhes da música
  return (
    <div className="music-details">
      <div className="music-header">
        <img 
          src={music.cover } 
          alt={`Capa do álbum ${music.album}`} 
          className="cover-img" 
        />
        <div className="music-info">
          <h2>{music.title} - {music.artist}</h2>
          <p><strong>Álbum:</strong> {music.album}</p>
          <p><strong>Ano:</strong> {music.releaseYear}</p>
          <p><strong>Duração:</strong> {music.duration }</p>
          {music.platforms && music.platforms.length > 0 && (
              <p><strong>Disponível em:</strong> {music.platforms.join(', ')}</p>
          )}
          {music.url && (
            <p><strong>Ouça aqui:</strong> <a href={music.url} target="_blank" rel="noopener noreferrer">Link da música</a></p>
          )}
        </div>
      </div>

      <div className="review-section">
        <button className="review-btn">FAZER REVIEW</button>
        <h3>Reviews:</h3>
        <p className="no-review">Ainda não há reviews para essa música.</p>
      </div>
    </div>
  );
}