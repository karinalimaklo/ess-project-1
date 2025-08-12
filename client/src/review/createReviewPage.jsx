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
    // Valor inicial '0' para representar "não selecionado", alinhado com os testes
    rating: '0', 
    texto: '',
  });
  const [success, setSuccess] = useState(false);

  // Função para obter o ID do usuário
  function getUserId() {
    return currentUser._id;
  }

  // Função para lidar com mudanças nos campos do formulário
  function handleChangeField(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Função isolada para a requisição de criação
  async function createReviewRequest(data) {
    return fetch('/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  // Função isolada para processar a resposta da requisição
  async function processCreateResponse(res) {
    if (res.ok) {
      setSuccess(true);
      setForm({ rating: '0', texto: '' }); // Reseta o formulário
      alert('Review criada com sucesso!'); // Mensagem alinhada com os testes
      navigate('/');
    } else {
      const errorData = await res.json();
      // Usa a mensagem de erro específica do backend, se disponível
      alert(errorData.details || `Erro ao enviar review: ${res.status}`);
    }
  }

  // Função principal para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    // Validação no frontend para corresponder aos cenários de teste
    if (!form.texto.trim()) {
        alert('Escreva algo para fazer o review!');
        return;
    }
    if (form.rating === '0') {
        alert('Selecione uma avaliação para continuar');
        return;
    }

    try {
      const res = await createReviewRequest({
        ...form,
        rating: parseInt(form.rating, 10), // Converte a nota para número antes de enviar
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
            {cover && (
              <img 
                src={cover} 
                alt={`Capa do álbum de ${artista}`} 
                className={styles.albumPhoto}
              />
            )}
            <p><strong>Música:</strong> {musica}</p>
            <p><strong>Artista:</strong> {artista}</p>

            {/* Select de avaliação com data-testid para o Cypress */}
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
            {/* Textarea com data-testid para o Cypress */}
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
        {/* Mensagem de sucesso opcional */}
        {success && (
          <div style={{ color: 'green', marginTop: 16 }}>
            Review enviada com sucesso!
          </div>
        )}
      </div>
    </>
  );
};

export default CriarReview;