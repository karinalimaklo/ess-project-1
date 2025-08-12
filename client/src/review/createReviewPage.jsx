import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './createReviewPage.module.css';
import currentUser from '../currentUser';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';

const CriarReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { musica, artista, cover } = location.state || {};

  const [form, setForm] = useState({
    rating: '0', 
    texto: '',
  });

  function getUserId() {
    return currentUser._id;
  }

  function handleChangeField(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function createReviewRequest(data) {
    return fetch('/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async function processCreateResponse(res) {
    if (res.ok) {
      setForm({ rating: '0', texto: '' });
      alert('Review criada com sucesso!');
      navigate('/');
    } else {
      const errorData = await res.json();
      alert(errorData.details || `Erro ao enviar review: ${res.status}`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.texto.trim()) {
        alert('Escreva algo para fazer o review!');
        return;
    }
    if (form.rating === '0') {
        alert('Selecione uma avaliação para continuar');
        return;
    }

    try {
      // Passamos a variável 'cover' que veio diretamente da navegação.
      const res = await createReviewRequest({
        ...form,
        rating: parseInt(form.rating, 10),
        musica,
        artista,
        cover, 
        userId: getUserId()
      });
      await processCreateResponse(res);
    } catch (error) {
      alert('Falha ao conectar com o servidor.');
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
            {/* Isto agora funcionará de forma fiável */}
            {cover && (
              <img 
                src={cover} 
                alt={`Capa do álbum de ${artista}`} 
                className={styles.albumPhoto}
              />
            )}
            <p><strong>Música:</strong> {musica}</p>
            <p><strong>Artista:</strong> {artista}</p>

            <select
              name="rating"
              value={form.rating}
              onChange={handleChangeField}
              className={styles.formInput}
              data-testid="rating-select" 
            >
              <option value="0" disabled>Selecione uma avaliação</option>
              <option value="1">★☆☆☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="3">★★★☆☆</option>
              <option value="4">★★★★☆</option>
              <option value="5">★★★★★</option>
            </select>

            <Button type="submit" data-testid="post-review-button">
              Post review
            </Button>
          </div>
          <div className={styles.rightCol}>
            <textarea
              name="texto"
              value={form.texto}
              onChange={handleChangeField}
              placeholder="Escrever review..."
              className={styles.formTextarea}
              data-testid="review-text-area"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CriarReview;