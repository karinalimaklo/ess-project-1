import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResults.css';
import CardWrapper from '../Card/Card';
import profilePic from '../../assets/profilePic.png';

import { PiSmileySadThin } from "react-icons/pi";

const SearchResults = ({ results, searchType, hasSearched }) => {
    const navigate = useNavigate();
  
    const handleClick = (item) => {
      if (searchType === 'musica') {
        navigate(`/details/${item.musicId}`);
      }
      if (searchType === 'usuario') {
        navigate(`/perfil/${item._id}`);
      }
    };
  
    if (!hasSearched) {
      return null;
    }

    if (!results || results.length === 0){
      return(
        <CardWrapper>
          <div className='no-results-container'>
            <PiSmileySadThin className="no-results-icon" />
            <div className="no-results-message">Nenhum resultado encontrado</div>
          </div>
        </CardWrapper>
      );
    }

    return (
      <div className="search-results">
        {results.map((item) => (
          <CardWrapper
          key={item._id || item.id} 
          onClick={() => handleClick(item)}
          style={{ cursor: 'pointer' }}
          tabIndex="0" 
        >
          <img
            src={
              searchType === 'musica'
                ? item.cover 
                : profilePic
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
        </CardWrapper>
        ))}
      </div>
    );
  };
  
  export default SearchResults;
