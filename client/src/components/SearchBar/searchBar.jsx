import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Alert from '../AlertModal/AlertModal';
import './SearchBar.css'; 
import Button from '../Button/Button';

const SearchBar = ({ onResults }) => {
  const [input, setInput] = useState('');
  const [searchType, setSearchType] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });

  const fetchData = async () => {
    if (!searchType) {
      setModalMessage({
        title: 'ATENÇÃO',
        body: 'Por favor, selecione se a busca é por música ou usuário.'
      });
      setIsModalOpen(true);
      return;
    }

    const query = input.trim() ? `?termo=${encodeURIComponent(input)}` : '';
    
    try {
      const endpoint =
        searchType === 'musica'
        ? `http://localhost:4000/musics/search${query}`
        : `http://localhost:4000/users/search${query}`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'A resposta da rede não foi ok');
      }

      const data = await res.json();
      onResults(data, searchType);

    } catch (error) {
      console.error('Erro ao buscar:', error);
      onResults([], searchType);
    }
  };

  return (
    <>
      <div className="input-wrapper">
        <div className="search-input-container">
          <FaSearch id="search-icon" />
          <input
            placeholder="Digite sua busca..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="">Buscar por...</option>
            <option value="musica">Música</option>
            <option value="usuario">Usuário</option>
          </select>
          <Button onClick={fetchData} >
            Buscar
          </Button>
        </div>
      </div>

      {/* modal de alerta */}
      <Alert
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </>
  );
};

export default SearchBar;
