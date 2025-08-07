import React, { useState } from 'react';
import styles from './createReviewPage.module.css';
import { useLocation } from 'react-router-dom';

const EditarReview = () => {
  const location = useLocation();
  const { review } = location.state || {};

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
    await fetch(`/reviews/${review._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  };

  return (
    <div className={styles.createReviewContainer}>
      <div className={styles.headerBar}>
        <img src="/menu-icon.svg" alt="Menu" className={styles.menuIconImg} />
        <span className={styles.headerTitle}>{user.name}</span>
        <img src={user.avatar} alt="Avatar" className={styles.headerAvatar} />
      </div>
      <form className={styles.reviewGrid} onSubmit={handleSubmit}>
        <div className={styles.leftCol}>
          <div className={styles.albumPhoto}>
            <img src={review.albumPhoto} alt='Capa do Álbum' />
          </div>

          <input
            type="text"
            value={review.musica}
            disabled
            className={styles.formInput}
          />

          <input
            type="text"
            value={review.artista}
            disabled
            className={styles.formInput}
          />

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

          <button type="submit" className={styles.submitButton}>
            Editar review
          </button>
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
  );
};

export default EditarReview;
