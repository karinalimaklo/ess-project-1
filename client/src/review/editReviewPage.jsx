import React, { useState } from 'react';
import styles from './createReviewPage.module.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import currentUser from '../currentUser';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';


const EditarReview = () => {
  const location = useLocation();
  const { review, musica, artista } = location.state || {};
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rating: review?.rating || 1,
    texto: review?.texto || '',
  });

  const user = {
    avatar: '/avatar-placeholder.png',
    name: 'CIntonia',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      console.log('Status:', response.status);

      if (!response.ok) {
        const text = await response.text(); // evita erro com HTML no lugar de JSON
        console.error('Erro do servidor:', text);
        alert(`Erro ao editar review (status ${response.status})`);
        return;
      }

      alert('Review editada com sucesso!');
      navigate('/meu-perfil');
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
      console.error(error);
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
          <div className={styles.albumPhoto}>
            <img src={review.albumPhoto} alt='Capa do Álbum' />
          </div>
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
            Editar review
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
    </div>
    </>
  );
};

export default EditarReview;
