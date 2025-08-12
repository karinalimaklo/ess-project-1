import React, { useState } from 'react';
import styles from './createReviewPage.module.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import currentUser from '../currentUser';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import { useEffect } from 'react';


const EditarReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //debuggando
  console.log("Dados recebidos:", location.state);

  const { review } = location.state || {};
  const { musica, artista } = review || {};

  const [coverUrl, setCoverUrl] = useState('');

  const [form, setForm] = useState({
    rating: review?.rating || 1,
    texto: review?.texto || '',
  });

  useEffect(() => {
    const fetchMusicCover = async () => {
      if (musica && artista) {
        try {
            const response = await fetch(`http://localhost:4000/musics/search?title=${encodeURIComponent(musica)}&artist=${encodeURIComponent(artista)}`);          
          if (!response.ok) {
            throw new Error('Erro na resposta da rede ao buscar a capa da música');
          }

          const musicData = await response.json();

          if (musicData && musicData.length > 0 && musicData[0].cover) {
            setCoverUrl(musicData[0].cover);
          }
        } catch (error) { 
          console.error('Erro ao buscar a capa da música:', error);
        }
      }
    };

    fetchMusicCover();
  }, [musica, artista]);

  const user = {
    avatar: '/avatar-placeholder.png',
    name: 'CIntonia',
  };

  // Encapsulate Field
  function getReviewId() {
    return review._id;
  }

  // Extract Method - mudança de formulário
  function handleChangeField(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Extract Method - requisição de edição
  async function updateReviewRequest(id, data) {
    return fetch(`http://localhost:4000/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Extract Method - tratamento de resposta
  async function processUpdateResponse(res) {
    if (res.ok) {
      alert('Review editada com sucesso!');
      navigate('/meu-perfil');
    } else {
      const text = await res.text();
      alert(`Erro ao editar review (status ${res.status}) - ${text}`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateReviewRequest(getReviewId(), form);
      await processUpdateResponse(res);
    } catch {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <>
    <Header
        onMenuClick={() => console.log("Abrir menu lateral")}
        avatarUrl={currentUser.avatar}
    />
    <div className={styles.createReviewContainer}>
      <form className={styles.reviewGrid} onSubmit={handleSubmit}>
        <div className={styles.leftCol}>
              {coverUrl && (
                <img 
                  src={coverUrl} 
                  alt={`Capa do álbum de ${artista}`} 
                  className={styles.albumPhoto}
                  data-testid="album-cover"
                />
              )}
            <p><strong>Música:</strong> {musica}</p>
            <p><strong>Artista:</strong> {artista}</p>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChangeField}
            required
            className={styles.formInput}
          >
            <option value={1}>★☆☆☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={4}>★★★★☆</option>
            <option value={5}>★★★★★</option>
          </select>

          <Button type="submit" className="review-btn">
            Editar review
          </Button>
        </div>
        <div className={styles.rightCol}>
          <textarea
            name="texto"
            value={form.texto}
            onChange={handleChangeField}
            required
            placeholder="Texto..."
            className={styles.formTextarea}
          />
        </div>
      </form>
    </div>
    </>
  );
};

export default EditarReview;
