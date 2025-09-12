import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./createReviewPage.module.css";
import currentUser from "../currentUser";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
import SuccessMessage from "../components/CadastroModal/SuccessMessage";
import FailMessage from "../components/CadastroModal/FailMessage";

const CriarReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { musica, artista, cover } = location.state || {}; // Checa se recebeu esses elementos

  const [form, setForm] = useState({
    // Valor inicial dos componentes quando carregado pela primeira vez
    rating: "0",
    texto: "",
  });

  const [successPopup, setSuccessPopup] = useState(null);
  const [failPopup, setFailPopup] = useState(null);

  // Refatoração Encapsulate Field
  function getUserId() {
    return currentUser._id;
  }

  function handleChangeField(e) {
    // Atualiza o estado do formulário
    const { name, value } = e.target; // (e) objeto do evento
    setForm((prev) => ({ ...prev, [name]: value })); // ...prev - cria cópia;
  }

  // Refatoração Extract Method
  async function createReviewRequest(data) {
    // Envia os dados da nova review ao servidor
    return fetch("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  // Refatoração Extract Method(antes tava no handleSubmit)
  async function processCreateResponse(res) {
    // Vê a resposta do servidor sobre o envio anterior
    if (res.ok) {
      setForm({ rating: "0", texto: "" });
      setSuccessPopup("REVIEW CRIADA COM SUCESSO!");
    } else {
      const errorData = await res.json();
      setFailPopup(errorData.details || `ERRO AO ENVIAR REVIEW: ${res.status}`);
    }
  }

  const handleSubmit = async (e) => {
    // Verifica se os dados foram preenchidos
    e.preventDefault(); // Impede que o navegador recarregue

    if (!form.texto.trim()) {
      setFailPopup("ESCREVA ALGO PARA FAZER A REVIEW!");
      return;
    }
    if (form.rating === "0") {
      setFailPopup("SELECIONE UMA AVALIAÇÃO PARA CONTINUAR");
      return;
    }

    try {
      const res = await createReviewRequest({
        //Objeto de dados final enviado
        ...form,
        rating: parseInt(form.rating, 10),
        musica,
        artista,
        cover,
        userId: getUserId(), // Encap. Field
      });
      await processCreateResponse(res);
    } catch (error) {
      setFailPopup("FALHA AO CONECTAR COM O SERVIDOR.");
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
            <p>
              <strong>Música:</strong> {musica}
            </p>
            <p>
              <strong>Artista:</strong> {artista}
            </p>

            <select
              name="rating"
              value={form.rating}
              onChange={handleChangeField}
              className={styles.formInput}
              data-testid="rating-select"
            >
              <option value="0" disabled>
                Selecione uma avaliação
              </option>
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

      {successPopup && (
        <SuccessMessage
          message={successPopup}
          onClose={() => {
            setSuccessPopup(null);
            navigate("/");
          }}
        />
      )}

      {failPopup && (
        <FailMessage message={failPopup} onClose={() => setFailPopup(null)} />
      )}
    </>
  );
};

export default CriarReview;
