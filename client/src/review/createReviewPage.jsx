import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- import useNavigate
import styles from './createReviewPage.module.css';
import currentUser from '../currentUser';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';


const user = currentUser;

const CriarReview = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <-- hook para navegação

  const { musica, artista, cover } = location.state || {};

  const [form, setForm] = useState({
    rating: 1,
    texto: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const res = await fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          musica,
          artista,
          cover,
          userId: user._id
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ rating: 1, texto: '' });

        // Redireciona para a home
        navigate('/');
      } else {
        const errorText = await res.text();
        alert(`Erro ao enviar review: ${res.status} - ${errorText}`);
      }
    } catch (err) {
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
              onChange={handleChange}
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
              Enviar review
            </Button>
          </div>
          <div className={styles.rightCol}>
            <textarea
              name="texto"
              value={form.texto}
              onChange={handleChange}
              required
              placeholder="Texto..."
              className={styles.formTextarea}
            />
          </div>
        </form>
        {success && <div style={{ color: 'green', marginTop: 16 }}>Review enviada com sucesso!</div>}
      </div>
    </>
  );
};

export default CriarReview;
