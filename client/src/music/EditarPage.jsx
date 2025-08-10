import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CadastroPage.css";
import camera from "../assets/cameracapa.png";
import CoverUploader from "../components/CadastroModal/CoverUploader";
import SuccessMessage from "../components/CadastroModal/SuccessMessage";
import FailMessage from "../components/CadastroModal/FailMessage";
import Button from "../components/Button/Button";

function EditarMusicaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    artista: "",
    album: "",
    ano: "",
    duracao: "",
    url: "",
    plataformas: [],
  });

  const [coverLink, setCoverLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await fetch(
          `https://localhost:4000/musics/${id}`
        );
        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados da música.");
        }
        const music = await response.json();

        setFormData({
          nome: music.title,
          artista: music.artist,
          album: music.album,
          ano: music.releaseYear,
          duracao: music.duration,
          url: music.url,
          plataformas: music.platforms,
        });
        setCoverLink(music.cover);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
        setShowFailMessage(true);
      }
    };

    fetchMusicData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const musicData = {
      title: formData.nome,
      artist: formData.artista,
      album: formData.album,
      releaseYear: parseInt(formData.ano),
      duration: formData.duracao,
      url: formData.url,
      platforms: formData.plataformas,
      cover: coverLink,
    };

    try {
      const response = await fetch(`https://localhost:4000/musics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(musicData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar a música.");
      }
      console.log("Requisição bem-sucedida! Resposta do servidor:", data);

      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Erro:", error.message);
      setErrorMessage(error.message);
      setShowFailMessage(true);
    }
  };

  return (
    <div className="cadastro-container">
      <h1>EDITAR MÚSICA</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-left">
          <div className="input-formulario">
            <label htmlFor="nome-musica-input">Nome da Música</label>
            <input
              type="text"
              name="nome"
              id="nome-musica-input"
              placeholder="Insira aqui..."
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="input-duas-linhas">
            <div className="input-formulario">
              <label htmlFor="nome-artista-input">Artista</label>
              <input
                type="text"
                name="artista"
                id="nome-artista-input"
                placeholder="Insira aqui..."
                value={formData.artista}
                onChange={handleChange}
              />
            </div>

            <div className="input-formulario">
              <label htmlFor="nome-album-input">Álbum</label>
              <input
                type="text"
                name="album"
                id="nome-album-input"
                placeholder="Insira aqui..."
                value={formData.album}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-duas-linhas">
            <div className="input-formulario">
              <label htmlFor="ano-input">Ano de Lançamento</label>
              <input
                type="text"
                name="ano"
                id="ano-input"
                placeholder="Insira aqui..."
                value={formData.ano}
                onChange={handleChange}
              />
            </div>

            <div className="input-formulario">
              <label htmlFor="duracao-input">Duração</label>
              <input
                type="text"
                name="duracao"
                id="duracao-input"
                placeholder="Insira aqui..."
                value={formData.duracao}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-duas-linhas">
            <div className="input-formulario">
              <label htmlFor="url-input">URL</label>
              <input
                type="text"
                name="url"
                id="url-input"
                placeholder="Insira aqui..."
                value={formData.url}
                onChange={handleChange}
              />
            </div>

            <div className="input-formulario" ref={dropdownRef}>
              <label htmlFor="plataformas-select">Plataformas</label>
              <div
                className="multiselect"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {formData.plataformas.length === 0 ? (
                  <span className="placeholder">Selecione aqui</span>
                ) : (
                  formData.plataformas.join(", ")
                )}
              </div>

              {dropdownOpen && (
                <ul className="options">
                  {["Spotify", "Deezer", "Apple Music"].map((option) => {
                    const isSelected = formData.plataformas.includes(option);
                    return (
                      <li
                        key={option}
                        className={`option-item ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => {
                            return {
                              ...prev,
                              plataformas: isSelected
                                ? prev.plataformas.filter((p) => p !== option)
                                : [...prev.plataformas, option],
                            };
                          });
                        }}
                      >
                        <span>{option}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="finalizar-cadastro">
            <Button type="submit">Salvar alterações</Button>
          </div>
        </div>

        <div className="capa-preview">
          <h3>Capa</h3>
          <img
            src={coverLink || camera}
            alt="capa"
            className="capa-musica"
            onClick={() => setShowPopup(true)}
          />

          <CoverUploader
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            onSubmit={(link) => setCoverLink(link)}
          />
        </div>
      </form>
      {showSuccessMessage && (
        <SuccessMessage
          message={"MÚSICA ATUALIZADA\nCOM SUCESSO!"}
          buttonText="VOLTAR AOS DETALHES DA MÚSICA"
          onClose={() => navigate(`/details/${id}`)}
        />
      )}

      {showFailMessage && (
        <FailMessage
          message={errorMessage.toUpperCase()}
          onClose={() => setShowFailMessage(false)}
        />
      )}
    </div>
  );
}

export default EditarMusicaPage;
