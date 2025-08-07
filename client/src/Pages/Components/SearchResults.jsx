import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../SearchResults.css';

const SearchResults = ({ results, searchType, hasSearched }) => {
    const navigate = useNavigate();
  
    const handleClick = (item) => {
      if (searchType === 'musica') {
        navigate(`/details/${item.musicId}`);
      }
      if (searchType === 'usuario') {
        //navigate(`usuario`);
        console.log('Navegando para o perfil do usuário:', item.name);
      }
    };
  
    if (!hasSearched) {
      return null;
    }
  
    // Mensagem de nenhum resultado
    if (!results || results.length === 0) {
      return <div className="no-results">Nenhum resultado encontrado</div>;
    }
  
    return (
      <div className="search-results">
        {results.map((item) => (
          <div
            key={item._id || item.id} 
            className="result-card"
            onClick={() => handleClick(item)}
            style={{ cursor: 'pointer' }}
            tabIndex="0" 
          >
            <img
              src={
                searchType === 'musica'
                  ? item.cover 
                  : item.avatar 
              }
              alt={searchType === 'musica' ? item.title : item.name}
              className="result-image"
            />
            <div className="result-info">
              {searchType === 'musica' ? (
                <>
                  <strong>{item.title}</strong>
                  <br />
                  <span>{item.artist}</span>
                </>
              ) : (
                <strong>{item.name}</strong>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default SearchResults;