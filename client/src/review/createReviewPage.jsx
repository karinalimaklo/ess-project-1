import React, { useState } from 'react';
import styles from './createReviewPage.module.css';
import currentUser from '../follow/currentUser';


const user = currentUser;

const CriarReview = () => {
  const [form, setForm] = useState({
    musica: '',
    rating: 1,
    artista: '',
    texto: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // reseta antes de enviar
    try {
      const res = await fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user._id }),
      });

      console.log('Status:', res.status);

      if (res.ok) {
        setSuccess(true);
        setForm({ musica: '', rating: 1, artista: '', texto: '' });
      } else {
        const errorText = await res.text();
        alert(`Erro ao enviar review: ${res.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Erro no fetch:', err);
      alert('Falha ao conectar com o servidor.');
    }
  };


  return (
    <div className={styles.createReviewContainer}>
      <div className={styles.headerBar}>
        <img src="/menu-icon.svg" alt="Menu" className={styles.menuIconImg} />
        <span className={styles.headerTitle}>CIntonia</span>
        <img src={user.avatar} alt="Avatar" className={styles.headerAvatar} />
      </div>
      <form className={styles.reviewGrid} onSubmit={handleSubmit}>
        <div className={styles.leftCol}>
          <div className={styles.albumPhoto}>Foto do Álbum</div>
          <input
            type="text"
            name="musica"
            value={form.musica}
            onChange={handleChange}
            required
            placeholder="Nome da música"
            className={styles.formInput}
          />
          <input
            type="text"
            name="artista"
            value={form.artista}
            onChange={handleChange}
            required
            placeholder="Artista"
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
            Enviar review
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
      {success && <div style={{ color: 'green', marginTop: 16 }}>Review enviada com sucesso!</div>}
    </div>
  );
};

export default CriarReview;