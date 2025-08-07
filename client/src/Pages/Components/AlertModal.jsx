import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../../AlertModal.css'; 

const AlertModal = ({ isOpen, onClose, message }) => {
  // O componente não renderiza nada se não estiver aberto
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-shadow">

      <div className="popup-box">

        <FaExclamationTriangle className="popup-icon" />
        
        <h2 className="popup-title">{message.title}</h2>
        <p className="popup-body">{message.body}</p>
        <button type="button" onClick={onClose} className="popup-button">
          Voltar para busca
        </button>
      </div>
    </div>
  );
};

export default AlertModal;